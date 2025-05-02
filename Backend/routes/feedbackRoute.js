const express = require("express");
const router = express.Router();
const Feedback = require("../model/feedback");

// Create a new Feedback
router.post("/addFeedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Fetch all Feedbacks
router.get("/getAllFeedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error fetching Feedbacks",
      error: err.message,
    });
  }
});

// Get one Feedback
router.get("/getFeedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().lean();
    const transformedFeedbacks = feedbacks.map((feedback) => ({
      ...feedback,
      _id: feedback._id.toString(),
      date: new Date(feedback.date).toISOString(),
    }));
    res.status(200).json(transformedFeedbacks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching feedbacks",
      error: error.message,
    });
  }
});

// Get feedback by employeeId (for employees to see their feedback)
router.get("/getFeedbackByEmployeeId/:employeeId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      employeeId: req.params.employeeId,
    }).lean();
    const transformedFeedbacks = feedbacks.map((feedback) => ({
      ...feedback,
      _id: feedback._id.toString(),
      date: new Date(feedback.date).toISOString(),
    }));
    res.status(200).json(transformedFeedbacks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching feedbacks",
      error: error.message,
    });
  }
});

// Get feedback by sender (for managers to see feedback they've sent)
router.get("/getFeedbackBySender/:sender", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ sender: req.params.sender }).lean();
    const transformedFeedbacks = feedbacks.map((feedback) => ({
      ...feedback,
      _id: feedback._id.toString(),
      date: new Date(feedback.date).toISOString(),
    }));
    res.status(200).json(transformedFeedbacks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching feedbacks",
      error: error.message,
    });
  }
});

// Update a Feedback by ID
router.put("/updateFeedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feedback) {
      return res.status(404).send();
    }
    res.status(200).send(feedback);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Mark feedback as viewed
router.put("/markAsViewed/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { viewed: true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback marked as viewed",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking feedback as viewed",
      error: error.message,
    });
  }
});

// Delete a Feedback by ID
router.delete("/deleteFeedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).send();
    }
    res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
