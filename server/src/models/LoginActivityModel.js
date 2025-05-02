const mongoose = require("mongoose");

const LoginActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "customers", required: true },
    loginTime: { type: Date, default: Date.now },
    ipAddress: { type: String },
    deviceInfo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginActivity", LoginActivitySchema);
