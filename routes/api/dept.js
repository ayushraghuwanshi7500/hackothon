const express = require('express');
const router = express.Router();

// @route   GET api/dept
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Department Route'));

module.exports = router;
