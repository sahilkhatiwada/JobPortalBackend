import Yup from "Yup";
import {
  jobTitle,
  EducationLevel,
  country,
  Salary,
  Experiences,
  Skills,
  JobTypeOption,
} from "../constants/general.constant.js";

/**
 * Validation schema for job registration.
 * Ensures that all fields are correctly validated before job creation.
 */
export const JobValidationSchema = Yup.object({
  companyName: Yup.string()
    .required("Company name is required"), // Validates that company name is provided
  companyLocation: Yup.string()
    .required("Company location is required"), // Validates that company location is provided
  companyPhoneNumber: Yup.string()
    .required("Company phone number is required"), // Validates that company phone number is provided
  jobTitle: Yup.string()
    .oneOf(jobTitle, "Job title is invalid") // Ensures job title is within the allowed options
    .required("Job title is required"), // Ensures job title is provided
  education: Yup.string()
    .oneOf(EducationLevel, "Education level is invalid") // Ensures education level is valid
    .required("Education is required"), // Validates education level is provided
  country: Yup.string()
    .oneOf(country, "Country is invalid") // Ensures country is within the allowed options
    .required("Country is required"), // Validates country is provided
  jobType: Yup.string()
    .oneOf(JobTypeOption, "Job type is invalid") // Ensures job type is valid
    .required("Job type is required"), // Validates job type is provided
  salary: Yup.string()
    .oneOf(Salary, "Salary option is invalid") // Ensures salary is within the allowed options
    .required("Salary is required"), // Validates salary is provided
  vacancies: Yup.number()
    .positive("Vacancy must be a positive number.") // Ensures vacancy is a positive number
    .integer("Vacancy must be an integer value.") // Ensures vacancy is an integer
    .required("Vacancy is required"), // Validates vacancy is provided
  experiences: Yup.string()
    .oneOf(Experiences, "Experience is invalid") // Ensures experience level is valid
    .required("Experience is required"), // Validates experience is provided
  skills: Yup.string()
    .oneOf(Skills, "Skills are invalid") // Ensures skills are within the allowed options
    .required("Skills are required"), // Validates skills are provided
  jobDescription: Yup.string()
    .required("Job description is required") // Ensures job description is provided
    .trim()
    .max(1000, "Job description must not exceed 1000 characters."), // Validates maximum length of job description
  jobLocation: Yup.string()
    .required("Job location is required"), // Validates job location is provided
});

/**
 * Validation schema for pagination.
 * Ensures that pagination parameters are valid for listing operations.
 */
export const paginationSchema = Yup.object({
  page: Yup.number("Page must be a number.")
    .min(1, "Page must be at least 1.") // Ensures page number is at least 1
    .integer("Page must be an integer value.") // Ensures page is an integer
    .default(1), // Sets default value for page
  limit: Yup.number()
    .min(1, "Limit must be at least 1.") // Ensures limit is at least 1
    .integer("Limit must be an integer value.") // Ensures limit is an integer
    .default(10), // Sets default value for limit
  searchText: Yup.string()
    .nullable()
    .trim()
    .default(null), // Optional search text
  jobTitle: Yup.string()
    .oneOf(jobTitle, "Job title is invalid") // Ensures job title is within allowed options
    .nullable()
    .trim()
    .default(null), // Optional job title
});

/**
 * Validation schema for job seeker-specific pagination.
 * Adds additional validation for paginated job searches by seekers.
 */
export const seekerPaginationSchema = Yup.object({
  page: Yup.number()
    .default(1) // Sets default page value
    .min(1, "Page must be at least 1."), // Ensures page is at least 1
  limit: Yup.number()
    .default(10) // Sets default limit value
    .min(1, "Limit must be at least 1."), // Ensures limit is at least 1
  searchText: Yup.string()
    .nullable()
    .trim()
    .default(null), // Optional search text
  jobTitle: Yup.string()
    .oneOf(jobTitle, "Job title is invalid") // Ensures job title is valid
    .nullable()
    .trim()
    .default(null), // Optional job title
});
