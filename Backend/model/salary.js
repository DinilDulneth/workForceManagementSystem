const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  basic: { type: Number, required: true },
  additionalIncentives: { type: Number, default: 0 },
  reductions: { type: Number, default: 0 }
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
