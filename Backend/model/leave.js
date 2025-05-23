const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const leaveSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    leavetype: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    session: {
      type: String,
      required: false
    },
    medicalCertificate: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    imagePath: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
