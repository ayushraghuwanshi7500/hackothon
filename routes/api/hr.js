const express = require('express');
const router = express.Router();
const JobDetail = require('../../models/jobdetails');

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

module.exports = router;
