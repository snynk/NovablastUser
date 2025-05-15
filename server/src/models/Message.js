const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" }, // ✅ Reference to Customer
  type: { type: String, default: null },
  twilioNumber: { type: String, required: true },
  number: { type: String, default: null },
  message: { type: String, default: null },
  media: { type: String, default: null }, // ✅ Can store media URL
  status: { type: String, required: true },
  sid: { type: String, default: null }, // ✅ Stores Twilio SID
  price: { type: Number, default: 0.0075 }, // ✅ Default message price
  error: { type: String, default: null }, // ✅ Stores error messages if any
  isView: { type: Boolean, default: false },
  trash: { type: Boolean, default: false }, // ✅ Stores whether the message is trashed
  isDelete: { type: Boolean, default: false }, // ✅ Stores whether the message is deleted
  scheduleType: { type: String, default: null },
  tive: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
