// Importing necessary modules
const express = require("express");
const passport = require("passport");

// Importing User model
const User = require("../models/user.model");

// Importing utilities
const { signAccessToken, signRefreshToken } = require("../utils/token.util");
const { setRefreshCookie } = require("../utils/refreshCookie.util");

// Import Rate Limiter middlewares
const {
  loginLimiter,
  registerLimiter,
} = require("../middlewares/rateLimiter.middleware");

// Importing middlewares
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

// Importing controllers
const register = require("../controllers/auths/register.controller");
const login = require("../controllers/auths/login.controller");
const refresh = require("../controllers/auths/refresh.controller");
const logout = require("../controllers/auths/logout.controller");
const requestPasswordReset = require("../controllers/auths/forgotPassword.controller");
const resetPassword = require("../controllers/auths/resetPassword.controller");
const validateResetToken = require("../controllers/auths/validateResetToken.controller");
const updatePassword = require("../controllers/auths/updatePassword.controller");
const verifyAccount = require("../controllers/auths/verifyAccount.controller");
const resendOtp = require("../controllers/auths/resendOtp.controller");

router.delete("/logout", authenticate, logout);

// router.post("/register", registerLimiter, register);
router.post("/register", register);

// router.post("/login", loginLimiter, login);
router.post("/login", login);

router.get("/refresh", authenticate, refresh);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  async (req, res) => {
    const user = await User.findOne({ googleId: req.user.googleId }).select(
      "-password -__v -createdAt -updatedAt -isVerified -googleId"
    );
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    const redirectUrl = `${process.env.CLIENT_URL}/google/callback?token=${accessToken}`;
    res.redirect(redirectUrl);
  }
);

router.post("/forgot-password", requestPasswordReset);
router.put("/reset-password", resetPassword);
router.post("/validate-reset-token", validateResetToken);
router.put("/update-password", authenticate, updatePassword);
router.put("/verify-account", verifyAccount);
router.post("/resend-otp", resendOtp);

module.exports = router;
