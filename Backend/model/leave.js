const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const leaveSchema = new Schema({
    id: {
        type: Number,
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
    medicalCertificate: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Add timestamps
});

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
