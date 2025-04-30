const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true }, // HR, IT, General Manager
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;
