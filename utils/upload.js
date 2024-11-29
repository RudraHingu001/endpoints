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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Use the upload directory
  },
  filename: (req, file, cb) => {
    // Make sure filenames are unique to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Append a unique suffix
  },
});


// Configure multer with limits
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).any(); // Use .any() to accept all fields, not just a specific one like 'images'

module.exports = { upload };