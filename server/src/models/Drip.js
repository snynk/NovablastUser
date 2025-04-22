const mongoose = require('mongoose');

const dripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [
    {
      day: Number,
      text: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drip', dripSchema);
