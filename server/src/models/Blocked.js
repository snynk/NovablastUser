const mongoose = require('mongoose');

const blockedSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  customerId: { type: String },  
  permanent: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blocked', blockedSchema);
