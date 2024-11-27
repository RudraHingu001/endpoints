const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to Category model
        required: true,
      },
      imageUrls: [String], // Array of image URLs
      selectedSize: { type: String, required: true },
      selectedColor: { type: String, required: true },
    },
  ],
  addressInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    roomNo: { type: String, required: true },
    street: { type: String, required: true },
    society: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'pending',
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  uniqueOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  shipmentId: String, // optional, used for shipment tracking
  paymentId: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
