const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');
const path = require('path');

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ email: 'admin@farmigo.com' });
    if (admin) {
      console.log('Admin found:', admin.email);
      console.log('Admin role:', admin.role);
    } else {
      console.log('Admin NOT found');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
