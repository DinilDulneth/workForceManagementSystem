const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  employeeId: { type: String }, // Changed from ObjectId to String to match frontend
  inquiry: { type: String, required: true },
  sender: { type: String }, // Changed from ObjectId to String
  date: { type: Date, default: Date.now },
  department: { type: String, required: true }, // Added department field
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);
module.exports = Inquiry;
