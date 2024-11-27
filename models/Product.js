const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to Category model
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fabric: {
    type: String,
    required: true,
  },
  washCareInstructions: {
    type: String,
    required: true,
  },
  colors: [String],
  imageUrls: [String], // Array of image URLs
  sizes: [{
    type: String,
    required: true,  // Example: 'S', 'M', 'L', 'XL'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);