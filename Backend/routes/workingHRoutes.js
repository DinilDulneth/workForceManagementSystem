const express = require("express");
const router = express.Router();
const WorkingH = require("../model/workingH");

// Add new working hours
router.route("/add").post((req, res) => {
  const { empID, wHours } = req.body;

  const newWorkingH = new WorkingH({
    empID,
    wHours,
    date: new Date(),
    time: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  });

  newWorkingH
    .save()
    .then(() => {
      res.json("Working hours uploaded successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Fetch all working hours
router.route("/").get((req, res) => {
  WorkingH.find()
    .then((workingHours) => {
      res.json(workingHours);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching working hours", error: err.message });
    });
});

// Fetch working hours by ID
router.route("/get/:id").get(async (req, res) => {
  try {
    let workingHID = req.params._id;
    const workingH = await WorkingH.findById(workingHID);
    if (!workingH) {
      return res.status(404).send({ status: "Working hours not found" });
    }

    res
      .status(200)
      .send({ status: "Working hours fetched", workingH: workingH });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error fetching working hours", error: err.message });
  }
});

// Fetch all working hours by empID
router.route("/getByEmpID/:id").get(async (req, res) => {
  try {
    const empID = req.params.id;

    const workingH = await WorkingH.find({ empID: empID });

    if (!workingH || workingH.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Working hours not found for this employee"
      });
    }

    // Fix 4: Consistent response format using json()
    res.status(200).json({
      status: "success",
      message: "Working hours fetched successfully",
      workingH: workingH
    });
  } catch (err) {
    console.error("Error fetching working hours:", err);
    res.status(500).json({
      status: "error",
      message: "Error fetching working hours",
      error: err.message
    });
  }
});
module.exports = router;
