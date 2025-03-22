import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FetchFeedback() {
  // Changed to named function with separate export
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    getFeedbacks();
  }, []);

  function getFeedbacks() {
    axios
      .get("http://localhost:8070/api/feedback/getFeedback") // Using your router's GET endpoint
      .then((res) => {
        console.log(res.data);
        setFeedbacks(res.data);
      })
      .catch((err) => {
        alert("Error fetching feedback: " + err.message);
        console.error(err);
      });
  }

  // Delete Feedback by ID
  function deleteFeedback(id) {
    axios
      .delete(`http://localhost:8070/api/feedback/deleteFeedback/${id}`) // Using your router's DELETE endpoint
      .then(() => {
        alert("Feedback deleted successfully");
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      })
      .catch((err) => {
        alert("Error deleting feedback: " + err.message);
        console.error(err);
      });
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Feedback List</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul className="list-group">
            {feedbacks.map((feedback) => (
              <li
                key={feedback._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>Employee ID: {feedback.employeeId}</strong> -
                  {feedback.feedback}
                  <br />
                  <small>
                    Sender: {feedback.sender} -{" "}
                    {new Date(feedback.date).toLocaleDateString()}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FetchFeedback;
