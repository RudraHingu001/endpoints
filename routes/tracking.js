// routes/tracking.js
const express = require('express');
const axios = require('axios');

const router = express.Router(); // Create a new router

// Route to track a shipment
router.get('/track/:shipmentId', async (req, res) => {
  const { shipmentId } = req.params;
  const token = process.env.SHIPROCKET_API_KEY;

  try {
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    res.json(response.data); // Forward the API response to the client
  } catch (error) {
    console.error('Error fetching shipping status:', error);
    res.status(500).json({ error: 'Failed to fetch shipment status' });
  }
});

module.exports = router; // Export the router
