const mongoose = require('mongoose');

const DeptSchema = new mongoose.Schema({
  mydept: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  vacancy: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  }
});

module.exports = Dept = mongoose.model('dept', DeptSchema);
