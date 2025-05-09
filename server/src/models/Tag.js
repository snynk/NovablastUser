const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ✅ Tag Label
  color: { type: String, required: true }, // ✅ Color Selection
  customerId: { type: String, required: true }, // ✅ Ensures only relevant customers access their tags
  createdAt: { type: Date, default: Date.now }, // ✅ Timestamp when tag was created
  
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
