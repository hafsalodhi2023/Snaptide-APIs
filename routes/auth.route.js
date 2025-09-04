// Importing necessary modules
const express = require("express");
const passport = require("passport");

// Importing utilities
const { signAccessToken, signRefreshToken } = require("../utils/token.util");
const setRefreshCookie = require("../utils/setRefreshCookie.util");

// Import Rate Limiter middlewares
const {
  loginLimiter,
  registerLimiter,
  forgotLimiter,
} = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

// Importing controllers
const register = require("../controllers/auths/register.controller");
const login = require("../controllers/auths/login.controller");

router.post("/register", registerLimiter, register);

router.post("/login", loginLimiter, login);

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
    const user = req.user;
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    const redirectUrl = `http://localhost:5173/google/callback?token=${accessToken}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
