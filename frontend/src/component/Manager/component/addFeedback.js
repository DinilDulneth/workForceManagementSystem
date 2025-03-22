import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [sender, setSender] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString());
    const userId = getCurrentUserId();
    setSender(userId);
  }, []);

  function getCurrentUserId() {
    // Replace this with your actual method to get the user ID
    // For example, you might get it from a token or a global state
    return "605c72ef2f799e2a4c8b4567"; // Example user ID
  }

  function sendFeedbackData(e) {
    e.preventDefault(); // ✅ Prevents form from reloading

    const newFeedback = {
      employeeId,
      feedback,
      sender,
      date,
    };

    axios
      .post("http://localhost:8070/api/feedback/addFeedback", newFeedback)
      .then(() => {
        alert("Feedback Added Successfully! ✅");
        setEmployeeId("");
        setFeedback("");
        setSender("");
        setDate("");
        navigate("/fetchFeedback");
      })
      .catch((err) => {
        alert("Error adding Feedback: " + err.message);
      });

    console.log(newFeedback);
  }

  return (
    <form className="container mt-4" onSubmit={sendFeedbackData}>
      <div className="form-group">
        <label htmlFor="exampleInputEmployeeId">Employee ID</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmployeeId"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="exampleInputFeedback">Feedback</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputFeedback"
          placeholder="Enter Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      {/* Hidden field for the sender */}
      <input
        type="hidden"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />

      {/* Hidden field for the current date */}
      <input
        type="hidden"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
