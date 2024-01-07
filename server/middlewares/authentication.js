const jsonWebToken = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token not found! Please sign in again to continue 🥲.....",
      });
    }
    try {
      const payload = jsonWebToken.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is invalid! Please sign in again to continue 🥲.....",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something went wrong while validating the authentication token! Sign in again to continue 🥲.....`,
    });
  }
};

// Authentication middleware for particular account type e.g. user , admin etc
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await userModel.findOne({
      email: req.user.email,
    });

    if (userDetails.accountType !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin 🥲.....",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `User role can't verified! Please sign in again to continue 🥲.....`,
    });
  }
};
