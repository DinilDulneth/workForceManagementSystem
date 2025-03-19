const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  dateOfJoining: { type: Date, required: true }
});

module.exports =
  mongoose.models.Manager || mongoose.model("Manager", ManagerSchema);
