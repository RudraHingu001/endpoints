const express = require('express');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const CancelRequest = require('../../models/CancelRequest');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.post('/create', async (req, res) => {
  const { cartItems, userid, email, addressInfo, paymentMethod, grandTotal, uniqueOrderId, shipmentId, paymentId, status } = req.body;

  try {
    const order = new Order({
      userid,
      email,
      cartItems,
      addressInfo,
      paymentMethod,
      grandTotal,
      uniqueOrderId,
      status, 
      shipmentId,
      paymentId,
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
});

router.get('/getorder/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const orders = await Order.find({ userid }).populate('cartItems.category');

    console.log('Fetched Orders:', orders);  // Log the orders for debugging

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

router.get('/getorders', async (req, res) => {

  try {
    const orders = await Order.find().populate('cartItems.category');

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

router.get('/getorderscount', async (req, res) => {

  try {
    const orders = await Order.find().populate('cartItems.category');

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.json(orders); 
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});


router.put('/updatestatus/:id/payment-status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOne({ uniqueOrderId: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = status;
    await order.save();

    res.json({ message: `Payment status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});


// Set up Multer storage for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save images in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/cancel-request', upload.single('productPhoto'), async (req, res) => {
  const { name, email, phoneNumber, reason, uniqueOrderId } = req.body;
  const productPhotoUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Store the file path

  try {
    // Save cancellation request in MongoDB
    const cancelRequest = new CancelRequest({
      name,
      email,
      phoneNumber,
      reason,
      productPhoto: productPhotoUrl,
      uniqueOrderId,
    });
    await cancelRequest.save();
    res.status(201).json({ message: 'Your cancellation request has been submitted!' });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Error submitting request', error: error.message });
  }
});

router.get('/getcancel-requests', async (req, res) => {
  try {
    const { page = 1, pageSize = 5, sortBy = 'createdAt', sortDesc = 'false' } = req.query;

    const skip = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    const sortDirection = sortDesc === 'true' ? -1 : 1;

    const cancelRequests = await CancelRequest.find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await CancelRequest.countDocuments();

    res.json({
      data: cancelRequests,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching cancel requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getPreviousAddress', async (req, res) => {
  const { phoneNumber } = req.query; // Get phoneNumber from query parameters

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    // Query MongoDB for order with matching phone number
    const order = await Order.findOne({ 'addressInfo.phoneNumber': phoneNumber }).exec();

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found for this phone number' });
    }

    // Extract address info from the order
    const { name, addressInfo } = order;

    // Return address info to frontend
    return res.status(200).json({
      success: true,
      address: {
        name: name,
        address: addressInfo.address,
        pincode: addressInfo.pincode,
        roomNo: addressInfo.roomNo,
        street: addressInfo.street,
        society: addressInfo.society,
        city: addressInfo.city,
      },
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch address' });
  }
});

module.exports = router;
