// controllers/auth/validateResetToken.controller.js
const crypto = require("crypto");
const PasswordResetToken = require("../../models/passwordToken.model");

async function validateResetToken(req, res) {
  try {
    const { userId, token } = req.query;
    if (!userId || !token) {
      return res.status(400).json({ valid: false, msg: "Missing params" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await PasswordResetToken.findOne({ userId, tokenHash });
    if (!record) {
      return res
        .status(400)
        .json({ valid: false, msg: "Invalid or expired token" });
    }

    if (record.used) {
      return res.status(400).json({ valid: false, msg: "Token already used" });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ valid: false, msg: "Token expired" });
    }

    return res.status(200).json({ valid: true });
  } catch (err) {
    return res.status(500).json({ valid: false, msg: "Server error" });
  }
}

module.exports = validateResetToken;
