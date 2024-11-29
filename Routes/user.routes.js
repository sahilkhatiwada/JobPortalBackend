import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { validateReqBody } from "../Middleware/validation.middleware.js";
import User from "../Models/userModel.js";
import { userRegSchema } from "../Validation/user.validation.js";
import { loginUserSchema } from "../validation/user.validation.js ";
const router = express.Router();

/**
 * Route to register a new user.
 * 
 * @route POST /user/register
 * @access Public
 * 
 * @middleware validateReqBody - Validates the request body against the user registration schema
 */
router.post("/user/register", validateReqBody(userRegSchema), async (req, res) => {
    try {
      // Extract new user details from the request body
      const newUser = req.body;
  
      // Check if a user with the provided email already exists in the database
      const existingUser = await User.findOne({ email: newUser.email });
      if (existingUser) {
        // Return a 409 Conflict response if the email is already registered
        return res.status(409).send({ message: "User with this email already exists." });
      }
  
      // Hash the password using bcrypt for secure storage
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword; // Replace the plain text password with the hashed password
  
      // Create a new user in the database
      await User.create(newUser);
  
      // Send a success response
      return res.status(201).send({ message: "User is registered successfully." });
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error during user registration:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  });
  


/**
 * Route to authenticate a user and provide a JWT token.
 * 
 * @route POST /user/login
 * @access Public
 * 
 * @middleware validateReqBody - Validates the request body against the login schema
 */
router.post("/user/login", validateReqBody(loginUserSchema), async (req, res) => {
    try {
      // Extract login credentials from the request body
      const loginCredentials = req.body;
  
      // Check if a user with the provided email exists in the database
      const user = await User.findOne({ email: loginCredentials.email });
      if (!user) {
        // Return a 404 Not Found response if the email is not registered
        return res.status(404).send({ message: "Invalid credentials." });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(
        loginCredentials.password,
        user.password
      );
      if (!isPasswordMatch) {
        // Return a 404 Not Found response if the password doesn't match
        return res.status(404).send({ message: "Invalid credentials." });
      }
  
      // Generate a JSON Web Token (JWT) for the authenticated user
      const token = jwt.sign(
        { email: user.email }, // Payload contains the user's email
        process.env.JWT_SECRET_KEY, // Secret key for signing the token
        { expiresIn: "24h" } // Token expiration time
      );
  
      // Exclude the password field from the user object in the response
      user.password = undefined;
  
      // Send a success response with the user details and the generated token
      return res.status(200).send({
        message: "Login successful.",
        user: user,
        token: token,
      });
    } catch (error) {
      // Log unexpected errors and return a 500 Internal Server Error response
      console.error("Error during user login:", error);
      return res.status(500).send({ message: "Internal Server Error." });
    }
  });

export default router;