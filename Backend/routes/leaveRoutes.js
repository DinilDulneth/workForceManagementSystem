const express = require("express");
const router = express.Router();
const Leave = require("../model/leave");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");

// Add new leave request with optional image upload
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    // Extract leave details from form data
    const { id, department, leavetype, date, medicalCertificate } = req.body;

    // Validate required fields
    if (!id || !department || !leavetype || !date) {
      return res.status(400).json({
        error:
          "All required fields (id, department, leavetype, date) must be provided"
      });
    }

    // Initialize leave data
    const leaveData = {
      id: Number(id),
      department,
      leavetype,
      date: new Date(date),
      medicalCertificate: medicalCertificate || "",
      status: "pending"
    };

    // Handle image upload to Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          })
          .end(req.file.buffer);
      });
      leaveData.imagePath = result.secure_url; // Store Cloudinary URL
    }

    // Save to MongoDB
    const newLeave = new Leave(leaveData);
    await newLeave.save();

    res.status(201).json({
      message: "Leave request added",
      leave: newLeave
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all leave requests
router.route("/").get((req, res) => {
  Leave.find()
    .then((leaves) => res.json(leaves))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Get a specific leave request by MongoDB ID
router.route("/get/:id").get((req, res) => {
  Leave.findById(req.params.id)
    .then((leave) => {
      if (!leave) return res.status(404).json({ error: "Leave not found" });
      res.json(leave);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Update leave request by ID with 24-hour expiration rule
router.route("/update/:id").put(async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    const now = new Date();
    const timeDiff = now - leave.createdAt; // in ms
    const hoursPassed = timeDiff / (1000 * 60 * 60); // convert ms to hours

    if (hoursPassed > 24) {
      return res
        .status(403)
        .json({ error: "Cannot update leave after 24 hours of creation" });
    }

    const { id, department, leavetype, date, medicalCertificate } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { id, department, leavetype, date, medicalCertificate },
      { new: true }
    );

    res.json({ message: "Leave updated", leave: updatedLeave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update leave status
router.route("/status/:id").put(async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leave.status = req.body.status;
    await leave.save();
    res.json({ message: "Leave status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete leave request by ID
router.route("/delete/:id").delete((req, res) => {
  Leave.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      if (!deleted) return res.status(404).json({ error: "Leave not found" });
      res.json({ message: "Leave deleted" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
