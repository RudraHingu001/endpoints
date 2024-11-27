const express = require('express');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const multer = require('multer');
const { uploadImages } = require('../../utils/upload'); // Import upload logic
const { upload } = require('../../utils/upload'); // Import multer upload middleware
const router = express.Router();

// Define the POST route for adding a product
router.post('/addproduct', upload, async (req, res) => {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const { name, price, category, description, sizes, fabric, washCareInstructions, colors } = req.body;

  try {
    // Get image URLs after the files have been uploaded
    const imageUrls = await uploadImages(req.files); 
    
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      sizes,
      fabric,
      washCareInstructions,
      colors,
      imageUrls,
    });
    
    // Save the new product to the database
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const uploads = multer({ storage });

router.put('/updateproduct/:id', uploads.array('images'), async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, sizes, fabric, washCareInstructions, colors } = req.body;
  const imageFiles = req.files;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;
    product.sizes = sizes;
    product.fabric = fabric;
    product.washCareInstructions = washCareInstructions;
    product.colors = colors;

    // Handle new images
    if (imageFiles && imageFiles.length > 0) {
      // Prepend '/uploads/' to each file path
      product.imageUrls = imageFiles.map(file => '/uploads/' + file.filename); // Prepend the `/uploads/` prefix
    }

    // Save the updated product
    await product.save();
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Route to fetch categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;