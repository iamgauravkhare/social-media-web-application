const express = require("express");
const router = express.Router();
const {
  serverConnection,
  signIn,
  signUp,
  sendOneTimePassword,
  changePassword,
} = require("../controllers/authentication");
const {
  resetPasswordLink,
  resetPassword,
} = require("../controllers/resetPassword");
const { authentication } = require("../middlewares/authentication");

// Server connection testing route -
router.get("/server-connection", serverConnection);

// Authentication routes.....

// Route for user sign in
router.post("/sign-in", signIn);

// Route for user sign up
router.post("/sign-up", signUp);

// Route for sending one time password to the user's email
router.post("/send-one-time-password", sendOneTimePassword);

// Route for changing the password
router.put("/change-password", authentication, changePassword);

// Reset password routes.....

// Route for generating a reset password link
router.post("/reset-password-link", resetPasswordLink);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;
