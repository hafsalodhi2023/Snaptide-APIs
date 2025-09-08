const {
  clearRefreshCookie,
  clearAccessCookie,
} = require("../../utils/refreshCookie.util");

const logout = (req, res) => {
  clearRefreshCookie(res);
  clearAccessCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = logout;
