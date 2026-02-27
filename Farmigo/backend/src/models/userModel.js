const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Important for security
    },

    role: {
      type: String,
      enum: ['Farmer', 'Buyer', 'Admin', 'Support', 'NGO'],
      default: 'Buyer',
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    // FARMER-SPECIFIC DETAILS
    farmDetails: {
      farmName: {
        type: String,
        required: function () {
          return this.role === 'Farmer';
        },
      },

      size: {
        type: String,
      },

      produceTypes: [
        {
          type: String,
          enum: [
            'Vegetables',
            'Fruits',
            'Grains',
            'Dairy',
            'Poultry',
            'Herbs',
            'Organic',
            'Mixed',
          ],
        },
      ],
    },

    // BADGES SYSTEM
    badges: [
      {
        name: {
          type: String,
        },
        awardedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // FARMER APPROVAL
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== 'Farmer';
        // Farmers must be approved by Admin
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    whatsappOptIn: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);


// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();  // Important fix
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);