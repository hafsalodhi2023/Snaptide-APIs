const User = require("../../models/user.model");

const { verifyAccessToken } = require("../../utils/token.util");
const {
  clearAccessCookie,
  clearRefreshCookie,
} = require("../../utils/refreshCookie.util");

const deleteProfile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const reason = req.body.reason;
    console.log("Reason for deletion:", reason);
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    clearAccessCookie(res);
    clearRefreshCookie(res);

    return res.status(200).json({ msg: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = deleteProfile;
