// Importing necessary modules
const express = require("express");

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

module.exports = router;
