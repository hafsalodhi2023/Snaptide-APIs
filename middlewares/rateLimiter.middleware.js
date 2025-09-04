const rateLimit = require("express-rate-limit");

// 🔹 Login limiter – prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Signup limiter – prevent mass registrations
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 per hour per IP
  message: {
    success: false,
    message: "Too many accounts created from this IP. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Forgot/reset password limiter – prevent spam
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests in 15 minutes
  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 General API limiter – apply to /api/* routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Global limiter (fallback - all requests combined)
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10000, // 10,000 requests total per minute
  keyGenerator: () => "global", // same key for everyone
  message: {
    success: false,
    message: "Server is receiving too many requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  signupLimiter: registerLimiter,
  resetLimiter: forgotLimiter,
  apiLimiter,
  globalLimiter,
};
