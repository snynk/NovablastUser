const mongoose = require('mongoose');
const AssignNumber = require('../models/AssignNumber'); // Adjust path to your AssignNumber model
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedAssignNumbers = async () => {
  try {
    // Clear existing records
    await AssignNumber.deleteMany({});

    // Generate 40 records
    const seedData = [];
    for (let i = 1; i <= 40; i++) {
      seedData.push({
        id: i,
        user_id: i,
        mobileno: `9876${100000 + i}`, // Example phone numbers
        number_type: i % 2 === 0 ? 'Toll-Free' : 'Local', // Alternate between 'Toll-Free' and 'Local'
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Set current time
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        group_id: null, // Example group_id, can be modified based on your needs
      });
    }

    // Insert the data into the AssignNumber collection
    await AssignNumber.insertMany(seedData);
    
    console.log('Assign numbers seeded successfully');
    process.exit(0); // Close the process after seeding
  } catch (error) {
    console.error('Error seeding assign numbers:', error);
    process.exit(1);
  }
};

seedAssignNumbers();
