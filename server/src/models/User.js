// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
},
email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
        validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`,
    },
},
passcode: {
    type: String,
    required: [true, 'Password is required'],
},
phone: {
    type: String,
    required: [true, 'Phone number is required'],
},
status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended'],
    default: 'Active',
},
address: {
    type: String,
    default: 'N/A',
},
}, {
timestamps: true, // Automatically adds createdAt and updatedAt fields
});


// Add virtual for the relations similar to Laravel
// UserSchema.virtual('sender', {
//   ref: 'Sender',
//   localField: '_id',
//   foreignField: 'user_id'
// });

// UserSchema.virtual('calls', {
//   ref: 'Call',
//   localField: '_id',
//   foreignField: 'user_id'
// });

// UserSchema.virtual('smslogs', {
//   ref: 'Smslog',
//   localField: '_id',
//   foreignField: 'user_id'
// });

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passcode')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passcode = await bcrypt.hash(this.passcode, salt);
    // this.conform_passcode = this.passcode;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passcode);
};

// Scope methods (similar to Laravel scopes)
UserSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

const User = mongoose.model('customers', UserSchema);

module.exports = User;