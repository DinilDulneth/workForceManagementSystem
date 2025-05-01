const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const leaveSchema = new Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true
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
    }
  },
  {
    timestamps: true
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
