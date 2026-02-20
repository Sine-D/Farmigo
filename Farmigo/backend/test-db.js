require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection with URI:', process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
    console.error('FAILED: MONGODB_URI is undefined');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILED: Could not connect to MongoDB', err.message);
        process.exit(1);
    });
