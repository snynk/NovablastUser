const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// ✅ Pre-save middleware to hash passwords correctly
ProfileSchema.pre("save", async function (next) {
  if (!this.isModified("passcode")) return next(); // ✅ Prevents hashing an already hashed password

  try {
    const salt = await bcrypt.genSalt(10);
    this.passcode = await bcrypt.hash(this.passcode, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Instance Method to Compare Passwords
ProfileSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.passcode);
};

// ✅ Fix: Prevent overwriting the model
const Profile = mongoose.models.customers || mongoose.model("customers", ProfileSchema);
module.exports = Profile;
