const express = require('express');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const router = express.Router();

router.get('/getproducts', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products); 
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Route to fetch products by category (optional)
router.get('/getproducts/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId }).populate('category');
    res.json(products); // Return products of a specific category
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Route to fetch products by price range (optional)
router.get('/getproducts/price', async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).populate('category');
    res.json(products); // Return products within the price range
  } catch (error) {
    console.error('Error fetching products by price:', error);
    res.status(500).json({ message: 'Error fetching products by price' });
  }
});

router.get('/getproducts/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Extract product _id from URL params
    const product = await Product.findById(productId); // Fetch product from MongoDB

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product); // Return the product details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;