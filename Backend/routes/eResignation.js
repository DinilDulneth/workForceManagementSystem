const express = require("express");
const router = express.Router();
const empResignation = require("../model/eResignation.js");

// Create a new empResignation
router.post("/addempRes", async (req, res) => {
  try {
    const empRes = new empResignation(req.body);
    await empRes.save();
    res.status(201).send(empRes); //case eka methana thiyenne(i think)
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all resignations
router.get("/getempRes", async (req, res) => {
  try {
    const empRes = await empResignation.find();
    res.status(200).send(empRes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a resignation by ID
// router.get("/getempResByID/:id", async (req, res) => {
//   try {
//     const empRes = await empResignation.findById(req.params.id);
//     if (!empRes) {
//       return res.status(404).send();
//     }
//     res.status(200).send(empRes);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Get an employee by ID
// router.route("/getempResByID/:id").get(async (req, res) => {
//   try {
//     const empRes = await empResignation.findById(req.params.empId);
//     if (!empRes) {
//       return res.status(404).send();
//     }
//     res.status(200).send(empRes);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Fetch resignation by ID
router.get("/getempResByID/:id", async (req, res) => {
  try {
    const empId = req.params.id;
    console.log("Searching for empId:", empId); // Add logging

    // Find resignations by empID
    const resignations = await empResignation.find({ empId: empId });
    console.log("Found resignations:", resignations); // Add logging

    if (!resignations || resignations.length === 0) {
      return res
        .status(404)
        .json({ message: "No resignation records found for this employee" });
    }

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching resignation records:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Get resignation by empId
router.get("/getempResByEmpId/:empId", async (req, res) => {
  try {
    const empId = req.params.empId;
    console.log("Searching for empId:", empId);

    // Find resignation(s) by empId
    const resignations = await empResignation.find({ empId: empId });
    console.log("Found resignations:", resignations);

    if (!resignations || resignations.length === 0) {
      return res
        .status(404)
        .json({ message: "No resignation records found for this employee" });
    }

    // Return the first resignation
    res.status(200).json(resignations[0]); // Or return resignations for all
  } catch (error) {
    console.error("Error fetching resignation record:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Update an employee by ID
//http://localhost:8070/resignation/updateempRes/67dc5a2fee0670a057333307

router.route("/updateempRes/:id").put(async (req, res) => {
  try {
    const empRes = await empResignation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!empRes) {
      return res.status(404).send();
    }
    res.status(200).send(empRes);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.delete("/deleteempRes/:id", async (req, res) => {
  try {
    const empRes = await empResignation.findByIdAndDelete(req.params.id);
    if (!empRes) {
      return res.status(404).send();
    }
    res.status(200).send(empRes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/getempResByID/:id", async (req, res) => {
  try {
    const empId = req.params.id;

    // Find resignations by empID
    const resignations = await empResignation.find({ empId: empId });

    if (!resignations || resignations.length === 0) {
      return res
        .status(404)
        .json({ message: "No resignation records found for this employee" });
    }

    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error fetching resignation records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add this new route to get a resignation by its _id
router.get("/getResById/:id", async (req, res) => {
  try {
    const resId = req.params.id;

    // Find resignation by _id directly
    const resignation = await empResignation.findById(resId);

    if (!resignation) {
      return res
        .status(404)
        .json({ message: "No resignation record found with this ID" });
    }

    res.status(200).json(resignation);
  } catch (error) {
    console.error("Error fetching resignation record:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
