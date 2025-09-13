const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const debug = require("debug")("server:models:user.model.js");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: { type: String },
    googleId: String,

    phone: String,
    country: String,
    state: String,
    city: String,

    avatar: {
      url: String,
      fileId: String,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//about phone address

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
