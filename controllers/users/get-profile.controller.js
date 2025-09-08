const debug = require("debug")(
  "server:controllers:users:get-profile.controller.js"
);

// Import the User model
const User = require("../../models/user.model");

// Import utilities
const { verifyAccessToken } = require("../../utils/token.util");

const getProfile = async (req, res) => {
  try {
    const { accessToken } = req.cookies;
    const decodedAccessToken = verifyAccessToken(accessToken);
    const { id } = decodedAccessToken;

    const user = await User.findById(id).select(
      "-password -__v -createdAt -updatedAt -provider -isVerified -googleId"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    debug(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = getProfile;
