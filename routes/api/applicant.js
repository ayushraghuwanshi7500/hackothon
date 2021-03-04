const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const JobForm = require('../../models/jobform');
const Applicant = require('../../models/applicant');
const upload = require('../../middleware/upload');
const jobform = require('../../models/jobform');
// @route   POST api/applicant
// @desc    Create job form

router.post(
  '/jobform',
  upload.single('resume'),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('phoneno', 'Phone no is required').not().isEmpty(),
    check('workexp', 'Work Exp is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      address,
      phoneno,
      workexp,
      email,
      skills,
      description
    } = req.body;
    try {
      let jobform = await JobForm.findOne({ email });
      if (jobform) {
        res
          .status(400)
          .json({ errors: [{ msg: 'You have already applied.' }] });
      }
      jobform = new JobForm({
        name,
        address,
        phoneno,
        workexp,
        email,
        description,
        skills
      });

      if (req.file) {
        jobform.resume = req.file.path;
      }

      await jobform.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Applied');
  }
);

// @route   POST api/applicant
// @desc    Create Applicant
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Minimum password length must be 6').isLength({ min: 6 }),
    check('email', 'Not a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let applicant = await Applicant.findOne({ email });
      if (applicant) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Applicant already exists' }] });
      }
      applicant = new Applicant({
        password,

        name,
        email
      });
      const salt = await bcrypt.genSalt(10);
      applicant.password = await bcrypt.hash(password, salt);
      await applicant.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Applicant created');
  }
);

// @route   POST api/applicant/login
// @desc    Login Applicant

router.post(
  '/login',
  [
    check('password', 'Password is required').exists(),
    check('email', 'Not a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let applicant = await Applicant.findOne({ email });
      if (!applicant) {
        return res.status(400).json({ isLoggedIn: false });
      }

      const isMatch = await bcrypt.compare(password, applicant.password);
      if (!isMatch) {
        return res.status(400).json({ isLoggedIn: false });
      }

      res.json({ isLoggedIn: true, userId: applicant._id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Applicant Logged In');
  }
);
module.exports = router;
