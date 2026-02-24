const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // USERS
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ORDER ITEMS
    items: [
      {
        name: { type: String, required: true }, // snapshot name
        image: { type: String }, // optional snapshot
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // SHIPPING ADDRESS
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // PAYMENT
    paymentMethod: {
      type: String,
      enum: ['card', 'cash_on_delivery', 'bank_transfer'],
      required: true,
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

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // PRICE DETAILS
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // DELIVERY
    deliveryStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    trackingNumber: {
      type: String,
      unique: true,
    },

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