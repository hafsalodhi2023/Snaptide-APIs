const crypto = require("crypto");
const User = require("../../models/user.model");
const PasswordResetToken = require("../../models/passwordToken.model");

const debug = require("debug")(
  "server:controllers:auths:resetPassword.controller.js"
);

async function resetPassword(req, res) {
  try {
    const { userId, token, newPassword } = req.body;
    if (!userId || !token || !newPassword) {
      return res
        .status(400)
        .json({ msg: "userId, token and newPassword required" });
    }

    // validate password rules (example)
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await PasswordResetToken.findOne({ userId, tokenHash });
    if (!record) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    if (record.used) {
      return res.status(400).json({ msg: "Token already used" });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ msg: "Token expired" });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = newPassword;
    // if user had provider != local, we should set provider to 'local' or keep both
    // Option: keep provider but mark that password now exists. Here we leave provider as-is.
    await user.save();

    // mark token used (single use)
    record.used = true;
    await record.save();

    // optional: invalidate sessions / refresh tokens for this user
    // depend on your token flow: e.g., increment tokenVersion or remove refresh tokens from DB

    return res.status(200).json({
      msg: "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    debug("Error in resetPassword:", err);
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = resetPassword;
