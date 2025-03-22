const mongoose = require("mongoose");

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  inquiry: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: { type: Date, default: Date.now },
});

// Create the Inquiry model
const Inquiry = mongoose.model("Inquiry", inquirySchema);

// Export the model using CommonJS syntax
module.exports = Inquiry;
