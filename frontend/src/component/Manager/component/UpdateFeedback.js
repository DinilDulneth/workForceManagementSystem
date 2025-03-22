import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateFeedback() {
  const { id } = useParams(); // Get feedback ID from URL params
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    employeeId: "",
    feedback: "",
    sender: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/api/feedback/getfeedback`) // Note: This should ideally be a single feedback endpoint
      .then((res) => {
        const feedbackData = res.data.find((item) => item._id === id);
        if (feedbackData) {
          setFeedback({
            employeeId: feedbackData.employeeId,
            feedback: feedbackData.feedback,
            sender: feedbackData.sender,
          });
        }
      })
      .catch((err) => {
        alert("Error fetching feedback: " + err.message);
      });
  }, [id]);

  function updateFeedbackData(e) {
    e.preventDefault();

    const updatedFeedback = {
      employeeId: feedback.employeeId,
      feedback: feedback.feedback,
      sender: feedback.sender,
    };

    axios
      .put(
        `http://localhost:8070/api/feedback/updatefeedback/${id}`,
        updatedFeedback
      )
      .then(() => {
        alert("Feedback Updated Successfully! ✅");
        navigate(`/employee-feedback/${feedback.employeeId}`); // Redirect back to employee's feedback list
      })
      .catch((err) => {
        alert("Error updating feedback: " + err.message);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value,
    });
  }

  return (
    <div className="container mt-4">
      <h2>Update Feedback</h2>
      <form onSubmit={updateFeedbackData}>
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            className="form-control"
            name="employeeId"
            value={feedback.employeeId}
            onChange={handleChange}
            disabled // Making it read-only as it shouldn't change
          />
        </div>

        <div className="form-group">
          <label>Feedback</label>
          <textarea
            className="form-control"
            name="feedback"
            value={feedback.feedback}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sender ID</label>
          <input
            type="text"
            className="form-control"
            name="sender"
            value={feedback.sender}
            onChange={handleChange}
            disabled // Making it read-only as it shouldn't change
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateFeedback;
