import job from "../Models/jobModel.js";

/**
 * Middleware to check if the logged-in user owns the job resource they are trying to access.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const checkJobOwnership = async (req, res, next) => {
  try {
    const jobId = req.params.id; // Extract the job ID from request parameters
    
    // Find the job by ID in the database
    const jobDetails = await job.findById(jobId);
    
    // If the job does not exist, respond with a 404 Not Found error
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Verify if the logged-in user is the owner of the job
    const isOwnerOfJob = req.loggedInUserId === jobDetails.owner.toString(); // Convert ObjectId to string for comparison
    
    // If the user is not the owner, respond with a 403 Forbidden error
    if (!isOwnerOfJob) {
      return res.status(403).json({
        message: "You are not authorized to perform this action.",
      });
    }

    // If ownership is verified, proceed to the next middleware
    next();
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error("Error in checkJobOwnership middleware:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
