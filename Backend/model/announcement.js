const mongoose = require("mongoose");

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: String,
  // Change the sender field to accept either ObjectId or String
  sender: {
    type: String, // Changed from ObjectId to String
    required: true,
  },
  // Add a separate field for storing the sender's name
  senderName: {
    type: String,
    default: "Admin",
  },
  date: { type: Date, default: Date.now },
});

// Create the Announcement model
const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
