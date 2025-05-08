// server/models/DripAutomation.js
const mongoose = require('mongoose');

const DripAutomationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  messages: [
    {
      day: {
        type: Number,
        required: [true, 'Please add a day'],
        min: [1, 'Day must be at least 1']
      },
      content: {
        type: String,
        required: [true, 'Please add message content'],
        trim: true
      },
      textSpinners: [
        {
          options: {
            type: [String],
            default: []
          }
        }
      ],
      mergeFields: [
        {
          field: {
            type: String,
            default: ""
          }
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DripAutomation', DripAutomationSchema);