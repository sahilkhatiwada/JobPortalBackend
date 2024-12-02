import mongoose from "mongoose";

/**
 * Middleware to validate MongoDB ObjectId in request parameters.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const checkMongoIdValidity = (req, res, next) => {
  const { id } = req.params; // Extract the `id` parameter from the request

  // Check if the provided ID is a valid MongoDB ObjectId
  const isValidMongoId = mongoose.Types.ObjectId.isValid(id);

  // If the ID is invalid, respond with a 400 Bad Request error
  if (!isValidMongoId) {
    return res.status(400).json({ message: "Invalid MongoDB ID." });
  }

  // If valid, proceed to the next middleware
  next();
};
