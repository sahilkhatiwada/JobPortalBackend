import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import the User model

/**
 * Middleware to verify if the user is authenticated as a "seeker".
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Object|void} - Sends an error response or proceeds to the next middleware
 */
// isUser middleware to check if user exists in the database and return a 401 error message if not
export const isUser = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Unauthorized - Invalid token format." });
    }
  
    const token = authorization.split(" ")[1];
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: ["HS256"],
      });
      const user = await User.findOne({ email: payload.email });
  
      if (!user) {
        return res
          .status(401)
          .send({ message: "Unauthorized - User not found." });
      }
  
      req.userDetails = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({ message: "Unauthorized - Invalid token." });
      } else {
        console.error("Token verification error:", error);
        return res.status(500).send({ message: "Internal Server Error." });
      }
    }
  };
export const isRecruiter = async (req, res, next) => {
    // Extract the Authorization header
    const authorization = req.headers.authorization;
  
    // Validate the presence and format of the token
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Unauthorized - Invalid or missing token format." });
    }
  
    // Extract the token from the Authorization header
    const token = authorization.split(" ")[1];
  
    try {
      // Verify the token using the secret key
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: ["HS256"], // Ensure the correct algorithm is used
      });
  
      // Find the user by email extracted from the token payload
      const user = await User.findOne({ email: payload.email });
  
      // Check if the user exists and has the "recruiter" role
      if (!user || user.role !== "recruiter") {
        return res
          .status(401)
          .send({ message: "Unauthorized - User not found or not a recruiter." });
      }
  
      // Attach user details to the request object for further use
      req.userDetails = user;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Handle invalid or expired token errors
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({ message: "Unauthorized - Invalid token." });
      }
  
      // Log unexpected errors and return a server error response
      console.error("Token verification error:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  };
  
export const isSeeker = async (req, res, next) => {
  // Extract the Authorization header
  const authorization = req.headers.authorization;

  // Validate the presence and format of the token
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Unauthorized - Invalid or missing token format." });
  }

  // Extract the token from the Authorization header
  const token = authorization.split(" ")[1];

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"], // Ensure the correct algorithm is used
    });

    // Find the user by email extracted from the token payload
    const user = await User.findOne({ email: payload.email });

    // Check if the user exists and has the "seeker" role
    if (!user || user.role !== "seeker") {
      return res
        .status(401)
        .send({ message: "Unauthorized - User not found or not a seeker." });
    }

    // Attach user details to the request object for further use
    req.userDetails = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: "Unauthorized - Invalid token." });
    }

    // Log unexpected errors and return a server error response
    console.error("Token verification error:", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};
