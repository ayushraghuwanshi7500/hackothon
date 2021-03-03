const express = require('express');
const router = express.Router();

// @route   GET api/applicant
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Applicant Route'));

module.exports = router;
