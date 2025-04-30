const express = require("express");
const router = express.Router();
const Inquiry = require("../model/inquiry");

// Create a new inquiry
router.post("/addInquiry", async (req, res) => {
  try {
    // Validate required fields
    const { employeeId, inquiry, department, title } = req.body;
    if (!employeeId || !inquiry || !department || !title) {
      return res.status(400).json({
        message:
          "Employee ID, title, inquiry, and department are required fields",
      });
    }

    const newInquiry = new Inquiry({
      employeeId,
      title,
      inquiry,
      sender: req.body.sender,
      date: req.body.date || new Date(),
      department,
    });

    const savedInquiry = await newInquiry.save();
    res.status(201).json(savedInquiry);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(400).json({
      message: "Error creating inquiry",
      error: error.message,
    });
  }
});

router.get("/getOneInquiry", async (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).send({ message: "Department is required" });
  }

  try {
    const inquiries = await Inquiry.find({ departments: department });

    if (inquiries.length === 0) {
      return res
        .status(404)
        .send({ message: "No inquiries found for this department" });
    }

    res.status(200).send(inquiries);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all inquiries
router.get("/getInquiry", async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    res.status(200).send(inquiries);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an inquiry by ID
router.get("/getInquiry/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching inquiry",
      error: error.message,
    });
  }
});

// Get inquiries by department
router.get("/getInquiryByDepartment/:department", async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ department: req.params.department });
    res.status(200).send(inquiries);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching inquiries by department",
      error: error.message,
    });
  }
});

// Update an inquiry by ID
router.put("/updateInquiry/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!inquiry) {
      return res.status(404).send();
    }
    res.status(200).send(inquiry);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an inquiry by ID
router.delete("/deleteInquiry/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).send();
    }
    res.status(200).send(inquiry);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
