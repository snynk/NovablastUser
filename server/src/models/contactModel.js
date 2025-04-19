const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Zip: { type: String, required: true },
  PropertyAddress: { type: String, required: true },
  PropertyCity: { type: String, required: true },
  PropertyState: { type: String, required: true },
  PropertyZip: { type: String, required: true },
  Phone1: { type: String, required: true },
  Phone2: { type: String }, // Optional
  Phone3: { type: String }, // Optional
  SampleName: { type: String, required: true }, // Added SampleName
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
