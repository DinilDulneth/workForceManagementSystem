const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  employeeId: { type: String, ref: "Employee" },
  title: { type: String, required: true }, // Added title field
  feedback: String,
  sender: { type: String, ref: "Employee" },
  date: { type: Date, default: Date.now },
  viewed: { type: Boolean, default: false }, // New field to track viewed status
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
