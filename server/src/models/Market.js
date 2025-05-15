const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  name: { type: String, required: true },
  // callForwardingNumber: { type: String, required: true },
  areaCode: { type: String, required: true },
  timeZone: { type: String, required: true },
  twilioNumber: { type: String, required: true }, // ✅ Store purchased Twilio number
  status: { type: String, enum: ["Accepted", "Pending", "Rejected"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Market", marketSchema);
