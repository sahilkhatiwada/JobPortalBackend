import nodemailer from "nodemailer";

/**
 * Sends a password reset email with a reset link.
 * 
 * This function uses **Nodemailer** to send an email containing a reset link to the user. 
 * The link will allow the user to reset their password. This functionality is crucial 
 * for user account recovery.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} resetLink - The URL containing the reset token for the user to reset their password.
 * @throws {Error} - Throws an error if email sending fails.
 */
const sendResetEmail = async (email, resetLink) => {
  try {
    // Create a Nodemailer transporter to send emails
    const transporter = nodemailer.createTransport({
      service: "your-email-service", // Use a service like Gmail, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or API key
      },
    });

    // Set up the email data including subject, body, and recipient
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender's email address (configured in environment variables)
      to: email, // Recipient's email address
      subject: "Password Reset Request", // Email subject
      html: `<h1>Reset Your Password</h1><p>Please click on the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`, // HTML body content with the reset link
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the link below to reset your password: ${resetLink}`, // Plain text version of the email
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log a success message for debugging purposes
    console.log("Reset email sent successfully.");
  } catch (error) {
    // Log the error and throw a more descriptive message
    console.error("Error sending reset email:", error);
    throw new Error("Error sending reset email: " + error.message); // Provide detailed error message
  }
};

export default sendResetEmail;
