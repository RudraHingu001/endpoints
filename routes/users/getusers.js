const express = require('express');
const User = require('../../models/User');
const router = express.Router();

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

module.exports = router;