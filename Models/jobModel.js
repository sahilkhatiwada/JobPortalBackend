import mongoose from "mongoose";
import {
  EducationLevel,
  Experiences,
  JobTypeOption,
  Salary,
  Skills,
  country,
  jobLocation,
  jobTitle,
} from "../constants/general.constant.js";

/**
 * Job Schema
 *
 * Represents the structure of a job posting in the database.
 */
const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // References the User model
    },
    companyName: {
      type: String,
      required: true,
      trim: true, // Removes extra whitespace
    },
    companyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    companyPhoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      enum: jobTitle, // Allowed job titles
    },
    education: {
      type: String,
      required: true,
      trim: true,
      enum: EducationLevel, // Allowed education levels
    },
    country: {
      type: String,
      enum: country, // Allowed countries
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: JobTypeOption, // Allowed job types (e.g., Full-time, Part-time)
    },
    salary: {
      type: String,
      required: true,
      enum: Salary, // Allowed salary ranges or types
    },
    vacancies: {
      type: Number,
      default: 1, // Default value if not specified
    },
    experiences: {
      type: String,
      required: true,
      enum: Experiences, // Allowed experience levels
    },
    skills: {
      type: String,
      required: true,
      enum: Skills, // Allowed skill sets
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: jobLocation, // Allowed job locations
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Job model
const Job = mongoose.model("Job", jobSchema);

export default Job;
