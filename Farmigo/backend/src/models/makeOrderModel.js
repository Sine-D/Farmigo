const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // USERS
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer is required'],
    },

    // ORDER ITEMS
    items: {
      type: [
        {
          name: { type: String, required: [true, 'Product name is required'] },
          image: { type: String },
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
          },
          quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
          },
          price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
          },
        },
      ],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },

    // SHIPPING ADDRESS
    shippingAddress: {
      address: { type: String, required: [true, 'Address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      postalCode: { type: String, required: [true, 'Postal code is required'] },
      country: { type: String, required: [true, 'Country is required'] },
    },

    // PAYMENT
    paymentMethod: {
      type: String,
      enum: {
        values: ['card', 'cash_on_delivery', 'bank_transfer'],
        message: 'Payment method must be card, cash_on_delivery, or bank_transfer',
      },
      required: [true, 'Payment method is required'],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // PRICE DETAILS
    taxPrice: { type: Number, default: 0, min: [0, 'Tax price cannot be negative'] },
    shippingPrice: { type: Number, default: 0, min: [0, 'Shipping price cannot be negative'] },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },

    // 🌱 HARVEST BASED SCHEDULING
    isPreOrder: { type: Boolean, default: false },

    harvestDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !v || v > Date.now();
        },
        message: 'Harvest date must be in the future',
      },
    },

    expectedDeliveryDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !v || v > Date.now();
        },
        message: 'Expected delivery date must be in the future',
      },
    },

    // DELIVERY
    deliveryStatus: {
      type: String,
      enum: [
        'pending',
        'scheduled',          // waiting for harvest
        'harvesting',         // farmer harvesting
        'ready_for_dispatch',
        'in_transit',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    trackingNumber: { type: String, unique: true },

    // OVERALL ORDER STATUS
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// AUTO GENERATE TRACKING NUMBER
orderSchema.pre('save', function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber =
      'AGR' +
      Date.now() +
      Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);