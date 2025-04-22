const express = require("express");
const router = express.Router();
const Inquiry = require("../model/inquiry");

// Create a new inquiry
router.post("/addInquiry", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).send(inquiry);
  } catch (error) {
    res.status(400).send(error);
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

// Update an inquiry by ID
router.put("/updateInquiry/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
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
