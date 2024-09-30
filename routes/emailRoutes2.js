const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/codemail', async (req, res) => {
  const to = req.body.to;
  const html = req.body.html;

  if (!to) {
    return res.status(400).send('Recipient email is required.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Thank You for Your Order!',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
