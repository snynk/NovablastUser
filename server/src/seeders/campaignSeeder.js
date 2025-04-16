require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Campaign = require('../models/Campaign');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

const seedCampaigns = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected for seeding');

    await Campaign.deleteMany();
    console.log('⚠️  Old campaigns removed');

    const dummyUserId = new mongoose.Types.ObjectId();

    const campaigns = Array.from({ length: 30 }, () => ({
      user_id: dummyUserId,
      name: faker.company.name(),
      secondstep: faker.lorem.words(2),
      usetollfree: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['active', 'inactive']), // Add status
    }));

    await Campaign.insertMany(campaigns);

    console.log('✅ 30 Campaigns inserted successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding campaigns:', err);
    mongoose.disconnect();
  }
};

seedCampaigns();
