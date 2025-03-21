const mongoose = require("mongoose");

const eResignationSchema = new mongoose.Schema({
  // empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empId: { type: String, required: true },
  Reason: { type: String, required: true },
  endDate: { type: String, required: true },
});

module.exports =
  mongoose.models.eResignation ||
  mongoose.model("eResignation", eResignationSchema);
