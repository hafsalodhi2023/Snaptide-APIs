const crypto = require("crypto");
const VerificationToken = require("../../models/otp.model");
const User = require("../../models/user.model");
const sendEmail = require("../../utils/mailer.util");
const { verifyPendingVerificationToken } = require("../../utils/token.util");

async function resendOtp(req, res) {
  try {
    const { token } = req.body;

    console.log(token);

    const payload = verifyPendingVerificationToken(token);

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ msg: "User already verified" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // invalidate old
    await VerificationToken.updateMany(
      { userId: user._id, used: false },
      { used: true }
    );

    // save new
    await VerificationToken.create({ userId: user._id, otpHash, expiresAt });

    // send email
    await sendEmail({
      to: user.email,
      subject: "Resent OTP - Verify your account",
      text: `Your OTP is ${otp}. Valid for 3 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 3 minutes.</p>`,
    });

    return res.json({ msg: "OTP resent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "Invalid or expired pending token" });
  }
}

module.exports = resendOtp;
