require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/userModel');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'jane@example.com' });
        if (user) {
            console.log('User found:', JSON.stringify(user, null, 2));
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkUser();
