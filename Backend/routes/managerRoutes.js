const express = require("express");
const router = express.Router();
const Manager = require("../model/Manager");

// Create a new Manager
router.post("/addManager", async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.status(201).send(manager);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all Managers
router.get("/getManager", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).send(managers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch all Managers
router.route("/getManager1").get((req, res) => {
  Manager.find()
    .then((manager) => {
      res.json(manager);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching manager", error: err.message });
    });
});

// Get a Manager by ID
router.route("/getManagerByID/:id").get(async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).send();
    }
    res.status(200).send(manager);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an Manager by email
router.route("/getManagerByEmail/:email").get(async (req, res) => {
  try {
    const manager = await Manager.findOne({ email: req.params.email });
    if (!manager) {
      return res.status(404).send();
    }
    res.status(200).send(manager);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a Manager by ID
router.patch("/updateManager/:id", async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!manager) {
      return res.status(404).send();
    }
    res.status(200).send(manager);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a Manager by ID
router.delete("/deleteManager/:id", async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).send();
    }
    res.status(200).send(manager);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
