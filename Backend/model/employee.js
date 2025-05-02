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

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: false,
    unique: true
  },
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfJoining: { type: String, required: false },
  availability: { type: String, required: false }
});

// Pre-save middleware to auto-generate employee ID
EmployeeSchema.pre("save", async function (next) {
  try {
    // Only generate the ID if it doesn't already exist
    if (!this.ID) {
      const counter = await Counter.findOneAndUpdate(
        { _id: "employeeId" }, // The unique identifier for the counter
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Create the counter document if it doesn't exist
      );

      // Generate the ID in the format EMP0001
      this.ID = `EMP${counter.seq.toString().padStart(4, "0")}`;
    }
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Export the Employee model
module.exports =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
