// server/server.js
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const emailRoutes2 = require('./routes/emailRoutes2'); // Import the email routes
const trackingRoutes = require('./routes/tracking'); // Import the tracking routes

const app = express();

app.use(cors());
app.use(express.json());

// Use the email routes under the '/api' prefix
app.use('/api', emailRoutes);

app.use('/api/COD', emailRoutes2);

// Use the tracking routes under the '/api/track' prefix
app.use('/api/track', trackingRoutes); // Adjusted to include '/api/track'

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});