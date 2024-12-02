import crypto from "crypto";

/**
 * Generates a secure, random token for password reset.
 * 
 * Uses the built-in `crypto` module to generate a random token. This token will be used to verify 
 * the user during the password reset process. The generated token is 40 characters long (20 bytes) 
 * and is encoded in hexadecimal format.
 * 
 * @returns {string} - A random token for password reset.
 */
const generateResetToken = () => {
  // Generate a secure random reset token of 40 characters (20 bytes)
  const token = crypto.randomBytes(20).toString("hex"); // `randomBytes(20)` generates 20 random bytes, which is then converted to a hex string.

  return token; // Return the generated token
};

export default generateResetToken;
