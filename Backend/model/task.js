const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const taskSchema = new Schema({
  tName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  empID: {
    type: String,
    required: true
  },
  assignedBy: {
    type: String,
    required: true
  },
  deadLine: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: false
  },
  priority: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true,
    default: 1
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
