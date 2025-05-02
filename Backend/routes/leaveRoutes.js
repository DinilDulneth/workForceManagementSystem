const express = require("express");
const router = express.Router();
const Leave = require("../model/leave");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add new leave request
router.route("/add").post((req, res) => {
  const { employeeId, department, leavetype, date, session, medicalCertificate } = req.body;

  const newLeave = new Leave({
    employeeId,
    department,
    leavetype,
    date,
    session,
    medicalCertificate
  });

  newLeave.save()
    .then(() => res.status(201).json("Leave request added"))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get all leave requests
router.route("/").get((req, res) => {
  Leave.find()
    .then(leaves => res.json(leaves))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get a specific leave request by MongoDB ID
router.route("/get/:id").get((req, res) => {
  Leave.findById(req.params.id)
    .then(leave => {
      if (!leave) return res.status(404).json({ error: "Leave not found" });
      res.json(leave);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update leave request by ID with 24-hour expiration rule
router.route("/update/:id").put(upload.single('image'), async (req, res) => {
  try {
    console.log("Update request received:", req.params.id, req.body);

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      console.log("Leave not found:", req.params.id);
      return res.status(404).json({ error: "Leave not found" });
    }

    const now = new Date();
    const timeDiff = now - leave.createdAt; // in ms
    const hoursPassed = timeDiff / (1000 * 60 * 60); // convert ms to hours

    if (hoursPassed > 24) {
      console.log("Update attempt after 24 hours:", hoursPassed);
      return res.status(403).json({ error: "Cannot update leave after 24 hours of creation" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // If there's a new image, update the imagePath
    if (req.file) {
      updateData.imagePath = req.file.path;
    }

    console.log("Updating leave with data:", updateData);

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedLeave) {
      console.log("Failed to update leave");
      return res.status(500).json({ error: "Failed to update leave" });
    }

    console.log("Leave updated successfully:", updatedLeave);
    res.json({ message: "Leave updated successfully", leave: updatedLeave });
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update leave status
router.route("/status/:id").put(async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    // Update the status
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ error: "Failed to update leave status" });
    }

    res.json({
      message: "Leave status updated successfully",
      leave: updatedLeave
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete leave request by ID
router.route("/delete/:id").delete((req, res) => {
  Leave.findByIdAndDelete(req.params.id)
    .then(deleted => {
      if (!deleted) return res.status(404).json({ error: "Leave not found" });
      res.json({ message: "Leave deleted" });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
