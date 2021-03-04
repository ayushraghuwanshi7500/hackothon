const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = ApplicantForm = mongoose.model('applicant', ApplicantSchema);
