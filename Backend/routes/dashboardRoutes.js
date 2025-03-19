const express = require("express");
const jwt = require("jsonwebtoken");
const HR = require("../model/HR");
const Manager = require("../model/Manager");
const Employee = require("../model/employee");

const router = express.Router();
const JWT_SECRET = "your_secret_key";

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/hr", authMiddleware, async (req, res) => {
  if (req.user.role !== "HR") {
    return res.status(403).json({ message: "Access denied" });
  }
  const hr = await HR.findById(req.user.id);
  res.json({ message: `Welcome HR ${hr.name}` });
});

router.get("/manager", authMiddleware, async (req, res) => {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied" });
  }
  const manager = await Manager.findById(req.user.id);
  res.json({ message: `Welcome Manager ${manager.name}` });
});

router.get("/employee", authMiddleware, async (req, res) => {
  if (req.user.role !== "Employee") {
    return res.status(403).json({ message: "Access denied" });
  }
  const employee = await Employee.findById(req.user.id);
  res.json({ message: `Welcome Employee ${employee.name}` });
});

module.exports = router;
