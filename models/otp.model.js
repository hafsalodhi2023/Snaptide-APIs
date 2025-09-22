const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otpHash: { type: String, required: true }, // hashed OTP
  expiresAt: { type: Date, required: true }, // for validity check
  used: { type: Boolean, default: false },
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// TTL to remove docs after e.g., 7 days from creation (for cleanup)
verificationTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);
module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
