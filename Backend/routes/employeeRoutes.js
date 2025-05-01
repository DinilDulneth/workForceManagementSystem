const express = require("express");
const router = express.Router();
const Employee = require("../model/employee");

// Create a new employee
// Create a new employee
// Create a new employee
router.post("/addEmp", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
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
      runValidators: true
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
