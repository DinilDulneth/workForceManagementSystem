const mongoose = require("mongoose");

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: { type: Date, default: Date.now },
});

// Create the Announcement model
const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
