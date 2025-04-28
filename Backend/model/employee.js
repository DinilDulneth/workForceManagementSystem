const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  salary: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  availability: { type: String, required: true }
});

module.exports =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
