const User = require("../../models/user.model");
const { verifyAccessToken } = require("../../utils/token.util");

async function updatePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const accessToken = req.cookies.accessToken;

    const payload = verifyAccessToken(accessToken);

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.password) {
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ msg: "Old password is incorrect" });
      }
    }
    // set new password
    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = updatePassword;
