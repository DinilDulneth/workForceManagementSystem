const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const workingHSchema = new Schema({
  empID: {
    type: String,
    required: true
  },
  wHours: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  time: {
    type: String,
    required: true,
    default: () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
  },
  status: {
    type: Number,
    required: true,
    default: 1
  }
});

const WorkingH = mongoose.model("WorkingH", workingHSchema);
module.exports = WorkingH;
