const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const JobForm = require('../../models/jobform');
// @route   POST api/applicant
// @desc    Create job form

router.post(
  '/jobform',
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

      await jobform.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Applied');
  }
);

module.exports = router;
