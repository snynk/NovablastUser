const mongoose = require("mongoose");

const groupedContactSchema = new mongoose.Schema({
  sampleName: { type: String, required: true, unique: true }, // List Name (CSV File Name)
  totalRows: { type: Number, required: true }, // Total Contacts in the List
  mobilesType: { type: String, default: null },
  landlinesType: { type: String, default: null },
  voip: { type: String, default: null },
  dnc: { type: String, default: null },
  duplicates: { type: Number, default: 0 }, // Duplicate contacts within the list
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GroupedContact", groupedContactSchema);
