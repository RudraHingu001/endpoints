const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const crypto = require('crypto');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

router.get('/getusers', async (req, res) => {
  const { sortBy, sortDesc, pageIndex = 0, pageSize = 5 } = req.query;
  try {
    let sortOrder = sortDesc === 'true' ? -1 : 1;

    const users = await User.find()
      .sort({ [sortBy]: sortOrder })
      .skip(parseInt(pageIndex) * parseInt(pageSize))
      .limit(parseInt(pageSize));

    const totalUsers = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting the User' });
  }
});


// Set up the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to generate a random 8-character password
const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};

// Forgot Password API route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new random password
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Email content: Send the new password to the user's email
    const emailHtml = `
      <html>
        <body>
          <h1>Password Reset for Your Account</h1>
          <p>Dear ${user.name},</p>
          <p>Your password has been successfully reset. Your new password is:</p>
          <h2>${newPassword}</h2>
          <p>Please make sure to change your password after logging in.</p>
          <p>If you did not request this change, please contact support immediately.</p>
        </body>
      </html>
    `;

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New Password',
      html: emailHtml,
    });

    res.status(200).json({ message: 'Password has been reset and sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

module.exports = router;