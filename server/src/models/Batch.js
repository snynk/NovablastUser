const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  messagesSent: {
    type: Number,
    default: 0
  },
  totalMessages: {
    type: Number,
    required: true
  },
  deliverability: {
    type: Number,
    default: 0
  },
  responseRate: {
    type: Number,
    default: 0
  },
  templateUsed: {
    type: String,
    default: "Default"
  },
  lastSendDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["pending", "sending", "completed", "failed", "paused"],
    default: "pending"
  },
  sendRate: {
    type: String,
    enum: ["slow", "normal", "fast"],
    default: "normal"
  },
  scheduledDate: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Batch", batchSchema);