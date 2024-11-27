const express = require('express');
const Category = require('../../models/Category');
const router = express.Router();

// Add category
router.post('/addcategory', async (req, res) => {
  const { name } = req.body;

  // Ensure name is provided
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Create and save a new category
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding category' });
  }
});

module.exports = router;
