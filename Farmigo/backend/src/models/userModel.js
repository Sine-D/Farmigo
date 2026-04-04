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
      select: false,
    },

    role: {
      type: String,
      enum: ['Farmer', 'Buyer', 'Admin', 'Support', 'NGO'],
      default: 'Buyer',
    },

    phoneNumber: String,
    whatsappOptIn: {
      type: Boolean,
      default: false,
    },

    location: String,

    farmDetails: {
      farmName: {
        type: String,
        required: function () {
          return this.role === 'Farmer';
        },
      },
      size: String,
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

    badges: [
      {
        name: String,
        awardedAt: { type: Date, default: Date.now },
      },
    ],

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== 'Farmer';
<<<<<<< Updated upstream
        // Farmers must be approved by Admin
=======
>>>>>>> Stashed changes
      },
    },

    isActive: {
      type: Boolean,
      default: true,
<<<<<<< Updated upstream
    },
    whatsappOptIn: {
      type: Boolean,
      default: false
=======
>>>>>>> Stashed changes
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);