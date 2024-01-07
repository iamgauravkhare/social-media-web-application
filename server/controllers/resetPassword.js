const userModel = require("../models/user");
const CustomErrorGenerateHandler = require("../utilities/customErrorGenerateHandler");
const emailHandler = require("../utilities/emailHandler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { tryCatchBlockHandler } = require("../utilities/tryCatchBlockHandler");

// Password reset route handlers -

// Send reset password link
exports.resetPasswordLink = tryCatchBlockHandler(async (req, res, next) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return next(
      new CustomErrorGenerateHandler(
        "This email is not registered with us! Please enter correct email 🥲.....",
        401
      )
    );
  }
  const token = crypto.randomBytes(20).toString("hex");
  const updatedDetails = await userModel.findOneAndUpdate(
    { email: email },
    {
      token: token,
      resetPasswordTokenExpiry: Date.now() + 3600000,
    },
    { new: true }
  );
  // const url = `http://localhost:3000/update-password/${updatedDetails._id}/${token}`;
  const url = `http://localhost:5173/update-password/${updatedDetails._id}/${token}`;
  await emailHandler(
    email,
    "Password Reset",
    `Your link for reset password is ${url}. Click on this link to reset your password.`
  );
  res.status(200).json({
    success: true,
    message:
      "Email sent successfully, Please check your email to continue further 😉.....",
  });
});

// Reset password
exports.resetPassword = async (req, res, next) => {
  const { password, confirmPassword, token } = req.body;
  if (confirmPassword !== password) {
    return next(
      new CustomErrorGenerateHandler(
        "Confirm password did't match! Try again 🥲.....",
        403
      )
    );
  }
  const userDetails = await User.findOne({ token: token });
  if (!userDetails) {
    return next(
      new CustomErrorGenerateHandler("Token is invalid 🥲.....", 401)
    );
  }
  if (!(userDetails.resetPasswordTokenExpiry > Date.now())) {
    return next(new CustomErrorGenerateHandler("Token expired 🥲.....", 401));
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { token: token },
    { password: encryptedPassword },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: `Password Reset Successful`,
    responsePayload: userDetails.email,
  });
};
