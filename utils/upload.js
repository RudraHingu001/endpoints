const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');

// Check if the uploads folder exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created');
}

// Set up file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the absolute path to the uploads directory
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Use timestamp for unique filenames
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// Configure multer with limits
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).array('images', 5); // Allow up to 5 images

// Function to generate image URLs from uploaded files
const uploadImages = (files) => {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      reject('No files uploaded');
    }
    const imageUrls = files.map(file => `/uploads/${file.filename}`); // Generate URLs based on filenames
    resolve(imageUrls);
  });
};

module.exports = { upload, uploadImages };