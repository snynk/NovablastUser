// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  conform_password: {
    type: String,
    required: true
  },
  assign_number: {
    type: String,
    default: null
  },
  upload_permission: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  email_verified_at: {
    type: Date,
    default: null
  },
  remember_token: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add virtual for the relations similar to Laravel
UserSchema.virtual('sender', {
  ref: 'Sender',
  localField: '_id',
  foreignField: 'user_id'
});

UserSchema.virtual('calls', {
  ref: 'Call',
  localField: '_id',
  foreignField: 'user_id'
});

UserSchema.virtual('smslogs', {
  ref: 'Smslog',
  localField: '_id',
  foreignField: 'user_id'
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.conform_password = this.password;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Scope methods (similar to Laravel scopes)
UserSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;