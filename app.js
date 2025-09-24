require("dotenv").config();
require("./config/passport.config");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const debug = require("debug")("server:app.js");

// Import Database Connection
const connectDB = require("./config/db.config");

// Import Rates Limit
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");

// Import Controllers
const avatarProxy = require("./controllers/avatarProxy.controller");

// Import Routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const uploadRoutes = require("./routes/upload.route");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter); // Apply global rate limiter
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Welcome to Snaptide APIs");
});

// Main Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/uploads", uploadRoutes);

app.get("/avatar-proxy", avatarProxy);

module.exports = app;
