const mongoose = require("mongoose");

// Counter schema for generating unique task IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Correctly registering the Counter model
const Counter = mongoose.model("Counter", CounterSchema);

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  ID: {
    type: String,
    required: false,
    unique: true
  },
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
  },
  attachmentPath: {
    type: String,
    required: false
  }
});

// Pre-save middleware to auto-generate task ID
taskSchema.pre("save", async function (next) {
  try {
    // Only generate the ID if it doesn't already exist
    if (!this.ID) {
      const counter = await Counter.findOneAndUpdate(
        { _id: "taskId" }, // The unique identifier for the counter
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Create the counter document if it doesn't exist
      );

      // Generate the ID in the format tID0001
      this.ID = `tID${counter.seq.toString().padStart(4, "0")}`;
    }
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
