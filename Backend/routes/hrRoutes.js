const express = require("express");
const router = express.Router();
const HR = require("../model/HR");

// Create a new HR
router.post("/addHR", async (req, res) => {
  try {
    const hr = new HR(req.body);
    await hr.save();
    res.status(201).send(hr);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all HRs
router.get("/getHR", async (req, res) => {
  try {
    const hrs = await HR.find();
    res.status(200).send(hrs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch all HRs
router.route("/getHR1").get((req, res) => {
  HR.find()
    .then((hr) => {
      res.json(hr);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ status: "Error fetching HR", error: err.message });
    });
});

// Get an HR by ID
router.route("/getHRByID/:id").get(async (req, res) => {
  try {
    const hr = await HR.findById(req.params.id);
    if (!hr) {
      return res.status(404).send();
    }
    res.status(200).send(hr);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an HR by ID
router.patch("/updateHR/:id", async (req, res) => {
  try {
    const hr = await HR.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hr) {
      return res.status(404).send();
    }
    res.status(200).send(hr);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an HR by ID
router.delete("/deleteHR/:id", async (req, res) => {
  try {
    const hr = await HR.findByIdAndDelete(req.params.id);
    if (!hr) {
      return res.status(404).send();
    }
    res.status(200).send(hr);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
