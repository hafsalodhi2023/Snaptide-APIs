const mongoose = require("mongoose");

const usersGraveyard = new mongoose.Schema({
  originalUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, // for quick lookups
  },
  userData: {
    // snapshot of the user document before deletion
    type: Object,
    required: true,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId, // admin/moderator id
    ref: "User",
  },
  reason: {
    type: String,
    default: "No reason provided",
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  meta: {
    clientIp: String,
    proxyChain: [String],
    userAgent: String,
  },
});

module.exports = mongoose.model("usersGraveyard", usersGraveyard);
