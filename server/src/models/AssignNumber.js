const mongoose = require('mongoose');

const assignNumberSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  mobileno: {
    type: String,
    required: true,
    unique: true
  },
  number_type: {
    type: String,
    required: true,
    enum: ['Local', 'Toll-Free']
  },
  created_at: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().slice(0, 19).replace('T', ' ');
    }
  },
  updated_at: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().slice(0, 19).replace('T', ' ');
    }
  },
  group_id: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('AssignNumber', assignNumberSchema);