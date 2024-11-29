const express = require('express');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const multer = require('multer');
const { uploadImages } = require('../../utils/upload'); // Import upload logic
const { upload } = require('../../utils/upload'); // Import multer upload middleware
const router = express.Router();

router.post('/addproduct', upload, async (req, res) => {
  console.log('Uploaded Files:', req.files);  // Check the files Multer has received

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // Log the incoming data for debugging
  console.log('Request Body:', req.body);  // Log the entire request body to inspect the fields
  console.log('Colors:', req.body.colors);  // Log the colors field to check its structure

  let { name, price, category, description, sizes, fabric, washCareInstructions, colors } = req.body;

  // Parse the colors field if it is a string
  if (typeof colors === 'string') {
    try {
      colors = JSON.parse(colors);  // Convert the string to an array
    } catch (error) {
      return res.status(400).json({ message: 'Error parsing colors field. Ensure it is valid JSON.' });
    }
  }

  // Ensure colors is an array
  if (!Array.isArray(colors)) {
    return res.status(400).json({ message: 'Colors must be an array' });
  }

  const colorImages = req.files.reduce((acc, file) => {
    // Match colorImages-#hexcode format (Updated regex to handle #)
    const match = file.fieldname.match(/^colorImages-(#[a-fA-F0-9]{6})$/);
    if (match) {
      const colorHex = match[1];  // Extract the full hex code with `#`

      if (!acc[colorHex]) {
        acc[colorHex] = [];
      }

      const imageUrl = `/uploads/${file.filename}`;
      acc[colorHex].push(imageUrl);  // Add image URL to the respective color
    } else {
      console.error(`File with invalid fieldname: ${file.fieldname}`);
    }
    return acc;
  }, {});

  // Map the colors array to include the image URLs
  const updatedColors = colors.map(color => {
    return {
      hex: color.hex,
      name: color.name,
      imageUrls: colorImages[color.hex] || [],
    };
  });

  try {
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      fabric,
      washCareInstructions,
      colors: updatedColors,
      sizes,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});



router.put('/updateproduct/:id', upload, async (req, res) => {
  // Log the incoming data for debugging
  console.log('Request Body:', req.body);  // Log the entire request body to inspect the fields
  console.log('Colors:', req.body.colors);  // Log the colors field to check its structure

  // Extract fields from the request body
  let { name, price, category, description, fabric, washCareInstructions, colors } = req.body;

  // If colors is a string, parse it into an array
  if (typeof colors === 'string') {
    try {
      colors = JSON.parse(colors);  // Convert the string to an array
    } catch (error) {
      return res.status(400).json({ message: 'Error parsing colors field. Ensure it is valid JSON.' });
    }
  }

  // Ensure colors is an array
  if (!Array.isArray(colors)) {
    return res.status(400).json({ message: 'Colors must be an array' });
  }

  // Initialize colorImages to track uploaded image files
  const colorImages = req.files ? req.files.reduce((acc, file) => {
    // Extract color hex from the fieldname (e.g., colorImages-#ec2323 -> #ec2323)
    const colorHex = file.fieldname.split('-')[1];  // This assumes the fieldname is formatted as 'colorImages-#ec2323'

    if (!colorHex) {
      // Handle cases where the fieldname doesn't match the expected format
      console.error('Invalid fieldname for color image:', file.fieldname);
      return acc;
    }

    if (!acc[colorHex]) {
      acc[colorHex] = [];
    }

    // Store the relative path of the uploaded image
    acc[colorHex].push(`/uploads/${file.filename}`);
    return acc;
  }, {}) : {};

  // Map the colors array to include the updated image URLs if files were uploaded
  const updatedColors = colors.map(color => {
    if (colorImages[color.hex]) {
      // If new images were uploaded for this color, update the imageUrls
      return {
        ...color,
        imageUrls: colorImages[color.hex],  // Use the relative URL for the color images
      };
    }
    // If no new images, keep the existing image URLs (no change)
    return color;
  });

  try {
    // Find the existing product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // Use the product ID from the URL params
      {
        name,
        price,
        category,
        description,
        fabric,
        washCareInstructions,
        colors: updatedColors,
      },
      { new: true } // Ensure that the returned product is the updated one
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the updated product details
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
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