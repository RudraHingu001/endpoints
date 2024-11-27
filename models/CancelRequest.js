const mongoose = require('mongoose');

const cancelRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  reason: { type: String, required: true },
  productPhoto: { type: String }, 
  uniqueOrderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CancelRequest', cancelRequestSchema);