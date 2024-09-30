const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for in-memory file uploads

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-email', upload.single('invoice'), async (req, res) => {
  console.log(req);
  const to = req.body.to;
  const html  = req.body.html;
  const attachment = req.file;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Thank You for Your Order!',
    html,
    attachments: [
      {
        filename: 'invoice.pdf',
        content: attachment.buffer, // The file buffer
        contentType: 'application/pdf',
      },
    ],
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
