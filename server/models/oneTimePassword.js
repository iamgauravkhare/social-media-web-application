const mongoose = require("mongoose");
const emailHandler = require("../utilities/emailHandler");
const oneTimePasswordVerificationEmailTemplate = require("../templates/email/emailVerification");

const oneTimePasswordSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  oneTimePassword: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

async function sendVerificationEmail(email, oneTimePassword) {
  try {
    const emailResponse = await emailHandler(
      email,
      "Verification Email",
      oneTimePasswordVerificationEmailTemplate(oneTimePassword)
    );
    console.log(`Email sent successfully 😉.....`);
  } catch (error) {
    console.error(error);
    console.log("Error occurred while sending email 🥲.....");
    throw error;
  }
}

oneTimePasswordSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.oneTimePassword);
  }
  next();
});

const oneTimePassword = mongoose.model(
  "oneTimePassword",
  oneTimePasswordSchema
);

module.exports = oneTimePassword;
