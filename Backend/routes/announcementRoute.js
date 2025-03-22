const express = require("express");
const router = express.Router();
const Announcement = require("../model/announcement");

// Create a new Announcement
router.post("/addAnnouncement", async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).send(announcement);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getoneAnnouncement", async (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).send({ message: "Department is required" });
  }

  try {
    const announcements = await Announcement.find({ departments: department });

    if (announcements.length === 0) {
      return res
        .status(404)
        .send({ message: "No announcements found for this department" });
    }

    res.status(200).send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get one Announcements
router.get("/getAnnouncement", async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch all Announcements
/*router.route("/getAllAnnouncement").get((req, res) => {
  Announcement.find()
    .then((announcements) => {
      res.json(announcements);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching Announcements", error: err.message });
    });
});*/

// Update an Announcement by ID
router.put("/updateAnnouncement/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!announcement) {
      return res.status(404).send();
    }
    res.status(200).send(announcement);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an Announcement by ID
router.delete("/deleteAnnouncement/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).send();
    }
    res.status(200).send(announcement);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
