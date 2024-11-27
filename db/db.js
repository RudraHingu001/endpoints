const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the connection string from your .env file
    const dbURI = process.env.DB_URI;
    if (!dbURI) {
      throw new Error('DB_URI is not defined in the .env file.');
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if there's a connection error
  }
};

module.exports = connectDB;
