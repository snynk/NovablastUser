const mongoose = require("mongoose");

const subUserSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, // ✅ Linked to customers
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  aliasName: { type: String },
  companyName: { type: String },
  phoneNumber: { type: String },
  timezone: { type: String },
  role: { type: String, enum: ["Admin", "Agent", "User"], default: "User" },
  active: { type: Boolean, default: true },
  avatar: { type: String }, // Store avatar URL
}, { timestamps: true });

module.exports = mongoose.model("SubUser", subUserSchema);
