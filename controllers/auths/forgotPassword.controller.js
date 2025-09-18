const crypto = require("crypto");
const User = require("../../models/user.model");
const PasswordResetToken = require("../../models/passwordToken.model");
const sendEmail = require("../../utils/mailer.util");

const debug = require("debug")(
  "server:controllers:auths:forgotPassword.controller.js"
);

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 3 * 60 * 1000;

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json({
        msg: "If an account exists, you'll receive an email with reset instructions.",
      });
    }

    await PasswordResetToken.updateMany(
      { userId: user._id, used: false },
      { used: true }
    );

    // generate token
    const token = crypto.randomBytes(TOKEN_BYTES).toString("hex"); // plain token to send in email
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      used: false,
    });

    // build reset url (change origin to your frontend)
    // frontend should open a page that POSTs new password + token to backend
    const frontendBase = process.env.CLIENT_URL;
    const resetUrl = `${frontendBase}/set-password?token=${token}&id=${user._id}`;

    // send email
    const subject = "Password reset link — valid for 3 minutes";
    const text = `Click the link to reset your password (valid 3 minutes): ${resetUrl}`;
    const html = `<p>Click the link to reset your password (valid 3 minutes):</p>
                  <p><a href="${resetUrl}">${resetUrl}</a></p>
                  <p>If you didn't request this, ignore.</p>`;

    await sendEmail({ to: user.email, subject, text, html });

    return res.status(200).json({
      msg: "If an account exists, you'll receive an email with reset instructions.",
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = requestPasswordReset;
