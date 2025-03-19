const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HR = require("../model/HR");
const Manager = require("../model/Manager");
const Employee = require("../model/Employee");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await HR.findOne({ email });
  user = await HR.findOne({ password });
  let role = "HR";

  if (!user) {
    user = await Manager.findOne({ email });
    user = await Manager.findOne({ password });
    role = "Manager";
  }

  if (!user) {
    user = await Employee.findOne({ email });
    user = await Employee.findOne({ password });
    role = "Employee";
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log("Password from request:", password);
  console.log("Hashed password from database:", user.password);

  // const isPasswordValid = await bcrypt.compare(password, user.password);

  // if (!isPasswordValid) {
  //   return res.status(400).json({ message: "Invalid (password) credentials" });
  // }

  const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token, role });
});

module.exports = router;
