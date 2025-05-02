const express = require("express");
const router = express.Router();
const Employee = require("../model/employee");

// Create a new employee
router.post("/addEmp", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    // Validate required fields
    const {
      name,
      position,
      department,
      email,
      password,
      phone,
      dateOfJoining,
      availability,
    } = req.body;

    if (
      !name ||
      !position ||
      !department ||
      !email ||
      !password ||
      !phone ||
      !dateOfJoining
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: Object.entries({
          name,
          position,
          department,
          email,
          password,
          phone,
          dateOfJoining,
          availability,
        })
          .filter(([key, value]) => !value)
          .map(([key]) => key),
      });
    }

    // Check for existing employee
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    console.log("Employee saved successfully:", savedEmployee);
    res.status(201).send(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error creating employee",
      error: error.message,
    });
  }
});

//http://localhost:8070/employee/getEmp

// Get all employees
router.get("/getEmp", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch all employee
router.route("/getEmp1").get((req, res) => {
  Employee.find()
    .then((employee) => {
      res.json(employee);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching employee", error: err.message });
    });
});

// Get an employee by ID
router.route("/getEmpByID/:id").get(async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an Employee by email
router.route("/getEmployeeByEmail/:email").get(async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email });
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an employee by ID
router.route("/updateEmp/:id").put(async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update employee's active status
router.patch("/updateActiveStatus/:id", async (req, res) => {
  try {
    const { availability } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );
    if (!employee) {
      return res.status(404).send({ error: "Employee not found" });
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.route("/deleteEmp/:id").delete(async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
