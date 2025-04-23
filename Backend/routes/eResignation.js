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
router.route("/getempResByID/:id").get(async (req, res) => {
  try {
    const empRes = await empResignation.findById(req.params.id);
    if (!empRes) {
      return res.status(404).send();
    }
    res.status(200).send(empRes);
  } catch (error) {
    res.status(500).send(error);
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

module.exports = router;
