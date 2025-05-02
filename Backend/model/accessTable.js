const mongoose = require("mongoose");

const AccessTableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  position: { type: String, required: false },
  department: { type: String, required: true },
  salary: { type: String, required: true },
  status: { type: String, required: true },
  access: { type: String, default: "1" } // 1: Active, 99: Revoked
});

module.exports =
  mongoose.models.AccessTable ||
  mongoose.model("AccessTable", AccessTableSchema);
