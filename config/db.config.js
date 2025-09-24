const mongoose = require("mongoose");
const debug = require("debug")("server:config:db.config.js");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    debug("Connected to MongoDB");
  } catch (error) {
    debug("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
