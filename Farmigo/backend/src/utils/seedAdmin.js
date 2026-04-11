const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const adminEmail = 'admin@farmigo.com';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin already exists. Updating password...');
      admin.password = 'AdminPassword@123';
      await admin.save();
      console.log('Password updated.');
    } else {
      console.log('Creating admin...');
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword@123',
        role: 'Admin',
        isApproved: true,
        isActive: true,
      });
      console.log('Admin created.');
    }

    const allUsers = await User.find({}).select('email role');
    console.log('Current users in DB:', allUsers);

    process.exit();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
