const passport = require("passport");
const crypto = require("crypto");
const VerificationToken = require("../../models/otp.model");
const User = require("../../models/user.model");
const sendEmail = require("../../utils/mailer.util");
const {
  signAccessToken,
  signRefreshToken,
  signPendingVerificationToken,
} = require("../../utils/token.util");
const { setRefreshCookie } = require("../../utils/refreshCookie.util");
const findLocation = require("../../utils/findLocation.util");

const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err)
        return res
          .status(500)
          .json({ msg: "Authentication error", isVerified: user.isVerified });
      if (!user)
        return res.status(401).json({
          msg: info?.msg || "Invalid credentials",
          isVerified: user.isVerified,
        });

      if (!user.isVerified) {
        try {
          // generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
          const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

          // invalidate old
          await VerificationToken.updateMany(
            { userId: user._id, used: false },
            { used: true }
          );

          // save new OTP
          await VerificationToken.create({
            userId: user._id,
            otpHash,
            expiresAt,
          });

          // send email
          await sendEmail({
            to: user.email,
            subject: "Verify your account - OTP",
            text: `Your OTP is ${otp}. Valid for 3 minutes.`,
            html: `<p>Your OTP is <b>${otp}</b>. It will expire in 3 minutes.</p>`,
          });

          // pending verification JWT
          const pendingToken = signPendingVerificationToken(user);

          return res.status(403).json({
            msg: "Account not verified. Please verify your email to continue.",
            token: pendingToken,
            isVerified: user.isVerified,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({ msg: "Could not send OTP" });
        }
      }

      // verified: normal login
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      setRefreshCookie(res, refreshToken);
      findLocation(req, res);

      return res.json({
        accessToken,
        isVerified: user.isVerified,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }
  )(req, res, next);
};

module.exports = login;
