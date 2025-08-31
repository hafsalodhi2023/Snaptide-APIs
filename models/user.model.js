const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const debug = require("debug")("server:models:user.model.js");

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,

    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,

    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    avatar: String,

    isVerified: { type: Boolean, default: false },

    googleId: String,
    facebookId: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    debug("Password not modified, skipping hash.");
    return next();
  }
  debug("Password is modified, Hashing password before saving user.");
  const salt = await bcryptjs.genSalt(10); // Generate salt for hashing
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
