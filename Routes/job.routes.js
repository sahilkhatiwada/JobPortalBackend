import express from "express";
import { validateReqBody } from "../Middleware/validation.middleware.js";
import {
  isRecruiter,
  isSeeker,
  isUser,
} from "../middleware/authentication.middleware.js";
import Job from "../Models/jobModel.js";
import {
  JobValidationSchema,
  seekerPaginationSchema,
} from "../validation/job.validation.js";
import { checkMongoIdValidity } from "../middleware/checkMongoIdValidity.js";
import { checkJobOwnership } from "../middleware/check.job.ownership.js";

const router = express.Router();

/**
 * Route to register a new job.
 *
 * @route POST /register/job
 * @access Private (Recruiter only)
 * @middleware isRecruiter - Validates that the user is a recruiter.
 * @middleware validateReqBody - Validates the job details against the schema.
 */
router.post(
  "/register/job",
  isRecruiter,
  validateReqBody(JobValidationSchema),
  async (req, res) => {
    try {
      const newJobData = req.body;
      const user = req.userDetails;

      // Assign user ID as the owner of the job
      newJobData.userId = user._id;

      // Create a new job in the database
      await Job.create(newJobData);

      // Send success response
      return res.status(201).send({
        message: "Job created successfully.",
      });
    } catch (error) {
      console.error("Error creating job:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  }
);

/**
 * Route to fetch job details by ID.
 *
 * @route GET /job/details/:id
 * @access Private (User only)
 * @middleware isUser - Validates that the user is authenticated.
 * @middleware checkMongoIdValidity - Validates that the ID is a valid MongoDB ObjectId.
 */
router.get(
  "/job/details/:id",
  isUser,
  checkMongoIdValidity,
  async (req, res) => {
    try {
      const jobId = req.params.id;

      // Find job by ID
      const jobDetails = await Job.findOne({ _id: jobId });
      if (!jobDetails) {
        return res.status(404).send({ message: "Job not found." });
      }

      // Hide owner ID before sending the response
      jobDetails.ownerId = undefined;

      // Send job details
      return res.status(200).send(jobDetails);
    } catch (error) {
      console.error("Error fetching job details:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  }
);

/**
 * Route to delete a job by ID.
 *
 * @route DELETE /job/delete/:id
 * @access Private (Recruiter only)
 * @middleware isRecruiter - Validates that the user is a recruiter.
 * @middleware checkMongoIdValidity - Validates the job ID.
 * @middleware checkJobOwnership - Ensures the recruiter owns the job.
 */
router.delete(
  "/job/delete/:id",
  isRecruiter,
  checkMongoIdValidity,
  checkJobOwnership,
  async (req, res) => {
    try {
      const jobId = req.params.id;

      // Delete job by ID
      await Job.deleteOne({ _id: jobId });

      // Send success response
      return res.status(200).send({ message: "Job deleted successfully." });
    } catch (error) {
      console.error("Error deleting job:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  }
);

/**
 * Route to edit a job by ID.
 *
 * @route PUT /job/edit/:id
 * @access Private (Recruiter only)
 * @middleware isRecruiter - Validates that the user is a recruiter.
 * @middleware checkMongoIdValidity - Validates the job ID.
 * @middleware validateReqBody - Validates the new job data against the schema.
 * @middleware checkJobOwnership - Ensures the recruiter owns the job.
 */
router.put(
  "/job/edit/:id",
  isRecruiter,
  checkMongoIdValidity,
  validateReqBody(JobValidationSchema),
  checkJobOwnership,
  async (req, res) => {
    try {
      const jobId = req.params.id;
      const newJobData = req.body;

      // Update job details
      await Job.updateOne({ _id: jobId }, { $set: { ...newJobData } });

      // Send success response
      return res.status(200).send({ message: "Job updated successfully." });
    } catch (error) {
      console.error("Error updating job:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  }
);

/**
 * Route to fetch job listings for a seeker with pagination.
 *
 * @route POST /job/seeker/list
 * @access Private (Seeker only)
 * @middleware isSeeker - Validates that the user is a job seeker.
 * @middleware validateReqBody - Validates the pagination schema.
 */
router.post(
  "/job/seeker/list",
  isSeeker,
  validateReqBody(seekerPaginationSchema),
  async (req, res) => {
    try {
      const { page, limit, searchText, jobTitle } = req.body;
      const skip = (page - 1) * limit;

      // Build filter query
      let match = {};
      if (searchText) {
        match.name = { $regex: searchText, $options: "i" };
      }
      if (jobTitle) {
        match.jobTitle = jobTitle;
      }

      // Fetch jobs with aggregation
      const jobs = await Job.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            companyName: 1,
            jobTitle: 1,
            education: 1,
            experience: 1,
            salary: 1,
            skills: 1,
            jobDescription: 1,
            jobLocation: 1,
          },
        },
      ]);

      // Calculate pagination
      const totalJobs = await Job.countDocuments(match);
      const pageCount = Math.ceil(totalJobs / limit);

      // Send response
      return res.status(200).send({
        message: "success",
        jobs,
        pageCount,
      });
    } catch (error) {
      console.error("Error fetching jobs for seeker:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  }
);

/**
 * Route to fetch job listings for a recruiter with pagination.
 *
 * @route POST /job/recruiter/list
 * @access Private (Recruiter only)
 * @middleware isRecruiter - Validates that the user is a recruiter.
 */
router.post("/job/recruiter/list", isRecruiter, async (req, res) => {
  try {
    const { page, limit, searchText } = req.body;
    const skip = (page - 1) * limit;

    // Build filter query
    let match = { ownerId: req.loggedInUserId };
    if (searchText) {
      match.name = { $regex: searchText, $options: "i" };
    }

    // Fetch jobs with aggregation
    const jobs = await Job.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          companyName: 1,
          jobTitle: 1,
          education: 1,
          experience: 1,
          salary: 1,
          skills: 1,
          jobDescription: 1,
          jobLocation: 1,
        },
      },
    ]);

    // Calculate pagination
    const totalJobs = await Job.countDocuments(match);
    const pageCount = Math.ceil(totalJobs / limit);

    // Send response
    return res.status(200).send({
      message: "success",
      jobs,
      pageCount,
    });
  } catch (error) {
    console.error("Error fetching jobs for recruiter:", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
});

export default router;
