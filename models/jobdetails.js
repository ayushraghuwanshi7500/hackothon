const mongoose = require('mongoose');

const JobDetailSchema = new mongoose.Schema({
  mydept: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  workexp: {
    type: Number,
    required: true
  },
  jobres: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  emptype: {
    type: String,
    required: true
  },
  vacancy: {
    type: Number,
    required: true
  },
  isposted: {
    type: Boolean,
    default: false
  }
});

module.exports = JobDetail = mongoose.model('jobdetail', JobDetailSchema);
