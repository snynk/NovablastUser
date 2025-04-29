const mongoose = require("mongoose");

const templateMessageSchema = new mongoose.Schema({
  messageNumber: { type: Number, required: true },
  content: { type: String, required: true },
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["Residential", "Commercial"] },
  messages: [templateMessageSchema],
  category: { type: String, default: "My templates" },
  templateType: { 
    type: String, 
    required: true, 
    enum: ["initial", "quick", "followup"],
    default: "initial"
  },
  delivery: { type: Number, default: 0 },
  response: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Template", templateSchema);