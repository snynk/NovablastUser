const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user
    const adminPassword = await bcrypt.hash('AGwins1722!!$$', 10);
    
    const users = [
      {
        name: 'Jack',
        email: 'Jake.stein@comcast.net',
        password: adminPassword,
        conform_password: adminPassword,
        status: 'active',
        gender: 'male',
        upload_permission: true,
        phone_number: '1234567890'
      },
    
    ];

    await User.insertMany(users);
    
    console.log('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();