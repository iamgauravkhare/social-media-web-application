const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const oneTimePasswordModel = require("../models/oneTimePassword");
const profileModel = require("../models/profile");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const emailHandler = require("../utilities/emailHandler");
const {
  passwordUpdateEmailTemplate,
} = require("../templates/email/passwordUpdate");
const CustomErrorGenerateHandler = require("../utilities/customErrorGenerateHandler");
const { tryCatchBlockHandler } = require("../utilities/tryCatchBlockHandler");

exports.serverConnection = tryCatchBlockHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are connected to template server 😉.....",
  });
});

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      oneTimePassword,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !oneTimePassword
    ) {
      return res.status(403).send({
        success: false,
        message: "All fields are required.....",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match! Please try again.....",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists! Please sign in to continue.....",
      });
    }

    const response = await oneTimePasswordModel
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (response.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "The one time password is not found! Please send it again.....",
      });
    } else if (oneTimePassword !== response[0].oneTimePassword) {
      return res.status(400).json({
        success: false,
        message: "The one time password is not valid.....",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let approved = true;
    accountType === "instructor" ? (approved = false) : (approved = true);

    const profileDetails = await profileModel.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: "",
    });

    return res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully.....",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered! Please try again.....",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please fill up all the required fields.....`,
      });
    }

    const user = await userModel
      .findOne({ email })
      .select("+password")
      .populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not registered with us! Please sign up to continue`,
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = undefined;
      res.status(200).json({
        success: true,
        token: token,
        data: user,
        message: `User signed in successfully.....`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect! Please sign in again.....`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong! Sign in failure please try again.....`,
    });
  }
};

exports.sendOneTimePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await userModel.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is already registered! Sign in to continue`,
      });
    }

    let generatedOneTimePassword = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await oneTimePasswordModel.findOne({
      oneTimePassword: generatedOneTimePassword,
    });

    while (result) {
      generatedOneTimePassword = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const oneTimePasswordPayload = {
      email,
      oneTimePassword: generatedOneTimePassword,
    };

    const oneTimePasswordBody = await oneTimePasswordModel.create(
      oneTimePasswordPayload
    );
    res.status(200).json({
      success: true,
      message: `One time password sent succesfully! Check your email.....`,
      oneTimePassword: generatedOneTimePassword,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userDetails = await userModel
      .findById(req.user.id)
      .select("+password");
    const { oldPassword, newPassword } = req.body;
    const isPasswordMatch = bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect! Try again 🥲.....",
      });
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await userModel.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      const emailResponse = await emailHandler(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdateEmailTemplate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error occurred while sending email");
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password");
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
