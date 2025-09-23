const crypto = require("crypto");
const VerificationToken = require("../../models/otp.model");
const User = require("../../models/user.model");
const {
  verifyPendingVerificationToken,
  signAccessToken,
  signRefreshToken,
} = require("../../utils/token.util");
const { setRefreshCookie } = require("../../utils/refreshCookie.util");

async function verifyOtp(req, res) {
  try {
    const { token, otp } = req.body;
    const payload = verifyPendingVerificationToken(token);

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ msg: "User already verified" });

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const record = await VerificationToken.findOne({
      userId: user._id,
      otpHash,
    });

    if (!record) return res.status(400).json({ msg: "Invalid OTP" });
    if (record.used) return res.status(400).json({ msg: "OTP already used" });
    if (record.expiresAt < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    // mark OTP as used
    record.used = true;
    record.usedAt = new Date();
    await record.save();

    user.isVerified = true;
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    return res.json({
      msg: "Account verified successfully",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    return res.status(400).json({ msg: "Invalid or expired token" });
  }
}

module.exports = verifyOtp;
