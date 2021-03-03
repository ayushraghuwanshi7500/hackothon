const express = require('express');
const router = express.Router();

// @route   GET api/hr
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('HR Route'));

module.exports = router;
