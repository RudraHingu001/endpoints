// routes/tracking.js
const express = require('express');
const axios = require('axios');

const router = express.Router(); // Create a new router

// Route to track a shipment
router.get('/track/:shipmentId', async (req, res) => {
  const { shipmentId } = req.params;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUyMzQyODMsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzI4NTM4NTUwLCJqdGkiOiJOOXFYSkZ0ZXpraWlwUFFWIiwiaWF0IjoxNzI3Njc0NTUwLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTcyNzY3NDU1MCwiY2lkIjo0OTkzODg2LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.hFwFrfmkVNo-edBfhUfWGIJELjofB-_fdlPOlsHFBc0'; // Replace with your actual token

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
