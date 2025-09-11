const User = require("../../models/user.model");
const { verifyAccessToken } = require("../../utils/token.util");

const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    const userId = decoded.id;

    const { firstName, lastName, phone, country, state, city } = req.body;
    const updatedData = { firstName, lastName, phone, country, state, city };

    // Remove undefined fields from updatedData
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password -__v -createdAt -updatedAt -isVerified -googleId");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = updateProfile;
