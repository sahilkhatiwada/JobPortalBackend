import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import generateResetToken from "../Utils/resetPasswordToken.js";
import sendResetEmail from "../Utils/sendResetEmail.js";

const router = express.Router();

// POST request to initiate password reset process
router.post("/user/forget", async (req, res) => {
  const { email } = req.body;
  
  // Validate email input
  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Generate a reset token and set expiration time (10 minutes)
    const resetToken = generateResetToken(user);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    // Construct the reset link with the generated token
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
    
    // Send the reset email with the link
    await sendResetEmail(email, resetLink);

    // Respond with success message
    res.status(200).send({ message: "Reset link sent to your email." });
  } catch (error) {
    // Handle server errors
    res.status(500).send({ message: "Internal server error." });
  }
});

// POST request to reset the user's password using the reset token
router.post("/user/reset/password", async (req, res) => {
  const { restToken, newPassword } = req.body;

  // Validate reset token and new password input
  if (!restToken || !newPassword) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    // Find the user by the reset token and ensure the token is still valid (not expired)
    const user = await User.findOne({
      resetPasswordToken: restToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token has not expired
    });

    // If no valid user is found, return an error
    if (!user) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear the reset token and expiration time after successful password reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Respond with success message
    res.status(200).send({ message: "Password reset successfully." });
  } catch (err) {
    // Handle server errors
    res.status(500).send({ message: "Internal server error." });
  }
});

export default router;
