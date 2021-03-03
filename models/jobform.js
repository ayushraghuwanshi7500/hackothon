const mongoose = require('mongoose');

const JobFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneno: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  workexp: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  }
});

module.exports = Jobform = mongoose.model('jobform', JobFormSchema);
