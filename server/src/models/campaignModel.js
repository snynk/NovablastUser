const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    marketId : {
      type: String,
      required: [true, "Market is required"],
      trim: true,
    },
    callForwardingNumber: {
      type: String,
      required: [true, "Call forwarding number is required"],
      trim: true,
    },
    contactListId: {
      type: String, // Changed from ObjectId to String to store SampleName
      required: [true, "Contact list is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional if authentication is not implemented yet
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    },
    parentCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: false,
    },
    monthWithoutResponse: {
      type: Number,
      required: false,
    },
    sent: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      default: 0,
    },
    hot: {
      type: Number,
      default: 0,
    },
    drip: {
      type: Number,
      default: 0,
    },
    deliverability: {
      type: String,
      default: "0%",
    },
    response: {
      type: String,
      default: "0%",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;