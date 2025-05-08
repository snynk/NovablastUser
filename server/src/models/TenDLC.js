const mongoose = require('mongoose');

const tenDlcSchema = new mongoose.Schema({
  // marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' }, // Linking to Market Table
  marketname: { type: String, required: true },
  customerId: { type: String, required: true },
  businessType: { type: String, required: true },
  taxId: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  brandName: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  verticalType: { type: String },
  zip: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TenDLC', tenDlcSchema);
