const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists in the database
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare the entered password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token (token will include userId and email)
      const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET || 'your_jwt_secret',  // Make sure to use an environment variable for your secret key
        { expiresIn: '1h' }  // Set expiration time (1 hour in this case)
      );

      // Send the response with user details and the token
      res.status(200).json({
        message: 'Login successful',
        userId: existingUser._id,
        token,  // Send the token to the client
        email: existingUser.email,  // Send email as part of the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
