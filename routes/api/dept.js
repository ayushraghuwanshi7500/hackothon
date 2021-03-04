const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const Dept = require('../../models/dept');
const JobDetail = require('../../models/jobdetails');

// @route   POST api/dept
// @desc    Create Department
router.post(
  '/',
  [
    check('mydept', 'ID is required').not().isEmpty(),
    check('password', 'Minimum password length must be 6').isLength({ min: 6 }),
    check('name', 'Name of department is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
    check('vacancy', 'Vacancy is required').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { mydept, name, skills, vacancy, password } = req.body;
    try {
      let dept = await Dept.findOne({ mydept });
      if (dept) {
        res
          .status(400)
          .json({ errors: [{ msg: 'Department already exists' }] });
      }
      dept = new Dept({
        mydept,
        password,
        vacancy,
        name,
        skills
      });
      const salt = await bcrypt.genSalt(10);
      dept.password = await bcrypt.hash(password, salt);
      await dept.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Deparement created');
  }
);
// @route   POST api/dept/login
// @desc    Login Department

router.post(
  '/login',
  [
    check('password', 'Password is required').exists(),
    check('mydept', 'ID is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { mydept, password } = req.body;
    try {
      let dept = await Dept.findOne({ mydept });
      if (!dept) {
        return res.status(400).json({ isLoggedIn: false });
      }

      const isMatch = await bcrypt.compare(password, dept.password);
      if (!isMatch) {
        return res.status(400).json({ isLoggedIn: false });
      }
      res.json({ isLoggedIn: true, userId: dept._id, userType: 'dept' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Department Logged In');
  }
);

// @route   POST api/dept/jobdetail
// @desc    Create Job Detail

router.post(
  '/jobdetail',
  [
    check('jobres', 'Job responsibility is required').not().isEmpty(),
    check('emptype', 'Employee Type is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
    check('vacancy', 'Vacancy is required').isNumeric(),
    check('workexp', 'Work Experirence is required').isNumeric(),
    check('position', 'Position is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      jobres,
      emptype,
      skills,
      vacancy,
      workexp,
      position,
      isposted,
      deptid
    } = req.body;

    try {
      //   vacancy inc of that department
      let jobdetail = await Dept.findOneAndUpdate(
        { _id: deptid },
        { $inc: { vacancy: vacancy } }
      );

      //   console.log(jobdetail);
      if (!jobdetail) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Department does not exists' }] });
      }
      // res.send(jobdetail);
      // create job details
      jobdetail = new JobDetail({
        jobres,
        emptype,
        skills,
        vacancy,
        workexp,
        position,
        isposted,
        deptid
      });

      await jobdetail.save();
    } catch (err) {
      console.error('this' + err.message + 'this msg');
      res.status(500).send(err);
    }
    res.send('Job Details Created');
  }
);
// @route   GET api/dept/getalljobdetail
// @desc    Get All job details

router.get('/getalljobdetail', async (req, res) => {
  try {
    const getalljobdetail = await JobDetail.find();
    res.json(getalljobdetail);
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});
// @route   GET api/dept/getalldept
// @desc    Get All dept

router.get('/getalldept', async (req, res) => {
  try {
    const getalljobdetail = await Dept.find();
    res.json(getalljobdetail);
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});
// @route   GET api/dept/:mydept/vacancy
// @desc    Get vacancy by deptid
router.get('/:mydept/vacancy', async (req, res) => {
  try {
    const getalljobdetail = await JobDetail.find({ deptid: req.params.mydept });
    res.json(
      getalljobdetail.map((job) => {
        return {
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

// @route   GET api/dept/jobdetails/:jobdetail_id
// @desc    Get job detail

router.get('/jobdetails/:jobdetail_id', async (req, res) => {
  try {
    const getalljobdetail = await JobDetail.find({
      _id: req.params.jobdetail_id
    });
    res.send(getalljobdetail);
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});

// @route   GET api/dept/:dept_id/skills
// @desc    get skills by department id

router.get('/:dept_id/skills', async (req, res) => {
  try {
    const dept = await Dept.find({ _id: req.params.dept_id });
    console.log(dept);
    res.json(
      dept.map((job) => {
        return job.skills;
      })
    );
  } catch (err) {
    console.error('this' + err.message + 'this msg');
    res.status(500).send(err);
  }
});

module.exports = router;
