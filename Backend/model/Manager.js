
const mongoose = require("mongoose");

// Check if the Counter model already exists before defining it
const Counter =
  mongoose.models.Counter ||
  mongoose.model(
    "Counter",
    new mongoose.Schema({
      _id: { type: String, required: true },
      seq: { type: Number, default: 0 }
    })
  );

const Schema = mongoose.Schema;

const ManagerSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: false,
    unique: true
  },
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  active: { type: Boolean, default: true }  // Adding active status field with default value true
});
// Pre-save middleware to auto-generate employee ID
ManagerSchema.pre("save", async function (next) {
  try {
    // Only generate the ID if it doesn't already exist
    if (!this.ID) {
      const counter = await Counter.findOneAndUpdate(
        { _id: "ManagerId" }, // The unique identifier for the counter
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Create the counter document if it doesn't exist
      );

      // Generate the ID in the format EMP0001
      this.ID = `MA${counter.seq.toString().padStart(4, "0")}`;
    }
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

module.exports =
  mongoose.models.Manager || mongoose.model("Manager", ManagerSchema);
