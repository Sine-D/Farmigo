const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

dotenv.config();

const fixAdmin = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'admin@farmigo.com';
        const pass = 'AdminPassword@123';

        await User.deleteOne({ email });

        await User.create({
            name: 'Farmigo Admin',
            email: email,
            password: pass,
            role: 'Admin',
            isApproved: true,
            isActive: true
        });

        console.log('User created: ' + email + ' / ' + pass);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixAdmin();
