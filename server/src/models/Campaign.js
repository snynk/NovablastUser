const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  secondstep: {
    type: String,
    required: true,
  },
  usetollfree: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });


module.exports = mongoose.model('Campaign', campaignSchema);
