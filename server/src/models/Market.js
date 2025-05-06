const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  callForwardingNumber: { type: String, required: true },
  areaCode: { type: String, required: true },
  timeZone: { type: String, required: true },
  status: { type: String, enum: ['Accepted', 'Pending', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Market', marketSchema);
