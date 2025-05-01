const express = require("express");
const Salary = require("../model/salary");
const Employee = require("../model/employee");
const router = express.Router();

// Get all salary records
router.get("/", async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json(salaries);
  } catch (err) {
    console.error("Error fetching salaries:", err);
    res.status(500).json({ message: "Error fetching salary records", error: err.message });
  }
});

// Get employee details for salary form
router.get("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findOne({ ID: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: "Error fetching employee details", error: err.message });
  }
});

// Add new salary record
router.post("/add", async (req, res) => {
  try {
    const { employeeId, name, basic, additionalIncentives, reductions } = req.body;

    if (!employeeId || !name || !basic) {
      return res.status(400).json({ message: "Employee ID, name, and basic salary are required" });
    }

    const existingSalary = await Salary.findOne({ employeeId });
    if (existingSalary) {
      return res.status(400).json({ message: "Salary record for this Employee ID already exists" });
    }

    const newSalary = new Salary({
      employeeId,
      name,
      basic,
      additionalIncentives: additionalIncentives || 0,
      reductions: reductions || 0
    });

    await newSalary.save();
    res.status(201).json({ message: "Salary record added successfully!", salary: newSalary });
  } catch (error) {
    console.error("Error adding salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update salary record
router.put("/update/:id", async (req, res) => {
  try {
    const { basic, additionalIncentives, reductions } = req.body;

    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      { 
        basic,
        additionalIncentives: additionalIncentives || 0,
        reductions: reductions || 0
      },
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

// Delete salary record
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

// Get single salary record
router.get("/:id", async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.json(salary);
  } catch (error) {
    console.error("Error fetching salary record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
