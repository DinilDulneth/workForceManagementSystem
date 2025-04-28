const express = require("express");
const Salary = require("../model/salary");
const router = express.Router();

// @route   GET /salaries/
// @desc    Get all salary records
router.get("/", async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json(salaries);
  } catch (err) {
    console.error("Error fetching salaries:", err);
    res.status(500).json({ message: "Error fetching salary records", error: err.message });
  }
});

// @route   POST /salaries/add
// @desc    Add a new salary record
router.post("/add", async (req, res) => {
  try {
    const { name, employeeId, paidHours, grossPay, statutoryPay, deductions, netPay, status } = req.body;

    // Validate required fields
    if (!name || !employeeId || !paidHours || !grossPay || !statutoryPay || !deductions || !netPay || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent duplicate Employee ID entries
    const existingSalary = await Salary.findOne({ employeeId });
    if (existingSalary) {
      return res.status(400).json({ message: "Salary record for this Employee ID already exists" });
    }

    // Create a new Salary Record
    const newSalary = new Salary({ name, employeeId, paidHours, grossPay, statutoryPay, deductions, netPay, status });
    await newSalary.save();

    res.status(201).json({ message: "Salary record added successfully!", salary: newSalary });

  } catch (error) {
    console.error("Error adding salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   DELETE /salaries/delete/:id
// @desc    Delete a salary record
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
    if (!deletedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.json({ message: "Salary record deleted successfully" });

  } catch (error) {
    console.error("Error deleting salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   PUT /salaries/update/:id
// @desc    Update a salary record
router.put("/update/:id", async (req, res) => {
  try {
    const { name, employeeId, paidHours, grossPay, statutoryPay, deductions, netPay, status } = req.body;

    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      { name, employeeId, paidHours, grossPay, statutoryPay, deductions, netPay, status },
      { new: true, runValidators: true }
    );

    if (!updatedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.json({ message: "Salary record updated successfully", salary: updatedSalary });

  } catch (error) {
    console.error("Error updating salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get a single salary record by ID
router.get("/:id", async (req, res) => {
  try {
    const salaryId = req.params.id;
    
    // Find the salary record by ID
    const salary = await Salary.findById(salaryId);
    
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json(salary);
  } catch (error) {
    console.error("Error fetching salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
