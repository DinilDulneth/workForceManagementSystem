const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true }, // Unique Employee ID
  paidHours: { type: String, required: true },
  grossPay: { type: String, required: true },
  statutoryPay: { type: String, required: true },
  deductions: { type: String, required: true },
  netPay: { type: String, required: true },
  status: { type: String, required: true }
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
