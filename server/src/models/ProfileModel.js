const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passcode: { type: String, required: true },
    phone: { type: String },
    status: { type: String, default: "Active" },
    address: { type: String },
    additionalFields: { type: Object }, // ✅ Allows dynamic fields
  },
  { timestamps: true }
);

// ✅ Fix: Prevent overwriting the model
const Profile = mongoose.models.customers || mongoose.model("customers", ProfileSchema);
module.exports = Profile;
