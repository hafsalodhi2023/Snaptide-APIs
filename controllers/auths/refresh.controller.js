const debug = require("debug")(
  "server:controllers:auths:refresh.controller.js"
);

// Importing User model
const User = require("../../models/user.model");

// Importing utilities
const {
  signRefreshToken,
  verifyRefreshToken,
  signAccessToken,
} = require("../../utils/token.util");
const { setRefreshCookie } = require("../../utils/refreshCookie.util");

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(403);

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    setRefreshCookie(res, newRefreshToken);
    return res.status(200).json({ accessToken });
  } catch (error) {
    debug(error);
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = refresh;
