require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/email/emailRoutes');
const emailRoutes2 = require('./routes/email/emailRoutes2');
const trackingRoutes = require('./routes/shiprocket/tracking');
const shipmentRoutes = require('./routes/shiprocket/shipmentRoutes');
const connectDB = require('./db/db'); 
const Signup = require('./routes/auth/Signup');
const Login = require('./routes/auth/Login');
const productRoutes = require('./routes/products/products');
const categoryRoutes = require('./routes/products/categories');
const getproductsRoutes = require('./routes/products/getproducts');
const getusers = require('./routes/users/getusers');
const order = require('./routes/orders/create');
const { upload } = require('./utils/upload');
const path = require('path');

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'https://react-project-seven-phi.vercel.app'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB(); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', emailRoutes);
app.use('/api/COD', emailRoutes2);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/track', trackingRoutes); 
app.use('/api/auth', Signup);
app.use('/api/auth', Login);
app.use('/api/products', productRoutes);
app.use('/api/products', categoryRoutes);
app.use('/api/products', getproductsRoutes);
app.use('/api/order', order);
app.use('/api/user', getusers);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
