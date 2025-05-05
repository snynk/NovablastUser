const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  market: { 
    type: String, 
    required: true 
  },
  callForwardingNumber: { 
    type: String, 
    required: true 
  },
  sent: { 
    type: Number, 
    default: 0 
  },
  remaining: { 
    type: Number, 
    default: 0 
  },
  hot: { 
    type: Number, 
    default: 0 
  },
  drip: { 
    type: Number, 
    default: 0 
  },
  deliverability: { 
    type: String, 
    default: "0%" 
  },
  response: { 
    type: String, 
    default: "0%" 
  },
  isFollowUp: {
    type: Boolean,
    default: false
  },
  parentCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    default: null
  },
  monthWithoutResponse: {
    type: String,
    default: null
  },
  created: { 
    type: Date, 
    default: Date.now 
  },
  updated: { 
    type: Date, 
    default: Date.now 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
});

module.exports = mongoose.model("Campaign", campaignSchema);