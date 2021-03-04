const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const JobDetail = require('../../models/jobdetails');
const Hr = require('../../models/hr');
const JobForm = require('../../models/jobform');

// @route   POST api/hr
// @desc    Create HR
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
      let hr = await Hr.findOne({ email });
      if (hr) {
        return res.status(400).json({ errors: [{ msg: 'HR already exists' }] });
      }
      hr = new Hr({
        password,

        name,
        email
      });
      const salt = await bcrypt.genSalt(10);
      hr.password = await bcrypt.hash(password, salt);
      await hr.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('HR created');
  }
);
// @route   POST api/hr/login
// @desc    Login HR

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
      let hr = await Hr.findOne({ email });
      if (!hr) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, hr.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      res.send(hr);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('HR Logged In');
  }
);

// @route   POST api/hr/jobisposted/:job_id
// @desc    Posting a job to Applicants

router.post('/jobisposted/:job_id', async (req, res) => {
  try {
    const job = await JobDetail.findOneAndUpdate(
      { _id: req.params.job_id },
      { $set: { isposted: true } }
    );
    await job.save();
    res.send('job is posted');
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});

// @route   GET api/hr/jobisposted
// @desc    Posted job to applicant

router.get('/jobisposted', async (req, res) => {
  try {
    const getalljobdetail = await JobDetail.find({ isposted: true });
    res.json(
      getalljobdetail.map((job) => {
        return {
          mydept: job.mydept,
          vacancy: job.vacancy,
          position: job.position,
          id: job._id
        };
      })
    );
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});

// @route   GET api/hr/jobisnotposted
// @desc    Posted not job to applicant

router.get('/jobisnotposted', async (req, res) => {
  try {
    const getalljobdetail = await JobDetail.find({ isposted: false });
    res.json(
      getalljobdetail.map((job) => {
        return {
          mydept: job.mydept,
          vacancy: job.vacancy,
          position: job.position,
          id: job._id
        };
      })
    );
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});
// @route GET api/hr/applications/:job_id
// @desc  GET all job applications by job detail id

router.get('/applications/:job_id', async (req, res) => {
  try {
    const getapplications = await JobForm.find({
      appliedforjobid: req.params.job_id
    });
    if (getapplications.length === 0) {
      return res.send('There are no applications for this jobs');
    }

    res.json(getapplications);
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});
module.exports = router;
