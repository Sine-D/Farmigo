const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['Farmer', 'Buyer', 'Admin', 'Support', 'NGO'],
            default: 'Buyer',
        },
        badges: [
            {
                name: String,
                awardedAt: { type: Date, default: Date.now },
            },
        ],
        phoneNumber: { 
            type: String,
             default: ""
        },
        location: String,
        farmDetails: {
            farmName: String,
            size: String,
            produceType: [String],
        },
        isApproved: {
            type: Boolean,
            default: false, // Farmers need admin approval
        },
        isActive: {
            type: Boolean,
            default: true,
        },         
        whatsappOptIn: {
             type: Boolean,
              default: false 
        }
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
