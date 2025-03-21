const express = require("express");
const router = express.Router();
const Leave = require("../model/leave");

// Add new leave request
router.route("/add").post((req, res) => {
    const { id, department, leavetype, date, medicalCertificate } = req.body;

    const newLeave = new Leave({
        id,
        department,
        leavetype,
        date,
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
router.route("/update/:id").put(async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ error: "Leave not found" });

        const now = new Date();
        const timeDiff = now - leave.createdAt; // in ms
        const hoursPassed = timeDiff / (1000 * 60 * 60); // convert ms to hours

        if (hoursPassed > 24) {
            return res.status(403).json({ error: "Cannot update leave after 24 hours of creation" });
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
        .then(deleted => {
            if (!deleted) return res.status(404).json({ error: "Leave not found" });
            res.json({ message: "Leave deleted" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
