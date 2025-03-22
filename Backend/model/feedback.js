// models/feedback.model.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  employeeId: { type: "String", ref: "Employee" },
  feedback: String,
  sender: { type: "String", ref: "Employee" },
  date: { type: "String", default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback; // Export the model using CommonJS syntax
