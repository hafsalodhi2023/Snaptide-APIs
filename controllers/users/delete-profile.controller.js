const User = require("../../models/user.model");
const UsersGraveyard = require("../../models/usersGraveyard.model");

const { verifyAccessToken } = require("../../utils/token.util");
const {
  clearAccessCookie,
  clearRefreshCookie,
} = require("../../utils/refreshCookie.util");

const deleteProfile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const reason = req.body.reason || "No reason provided";

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

    // Collect meta info
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "Unknown IP";

    const proxyChain = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",").map((ip) => ip.trim())
      : [];

    const userAgent = req.headers["user-agent"] || "Unknown";

    // Save snapshot in Graveyard
    await UsersGraveyard.create({
      originalUserId: user._id,
      userData: user.toObject(),
      deletedBy: user._id, // self-deleted
      reason,
      meta: {
        clientIp,
        proxyChain,
        userAgent,
      },
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear cookies
    clearAccessCookie(res);
    clearRefreshCookie(res);

    return res.status(200).json({ msg: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = deleteProfile;
