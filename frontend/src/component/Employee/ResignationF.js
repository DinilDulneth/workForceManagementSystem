import React, { useState } from "react";
import axios from "axios";

import "./resignationF.css";

export default function ResignationF() {
  const [submitted, setsubmitted] = useState(false);
  const [empID, setempID] = useState("1");
  const [reason, setreason] = useState("");
  const [endDate, setendDate] = useState("");

  function setResignation(e) {
    e.preventDefault();
    const newResignation = {
      empId: empID,
      Reason: reason,
      endDate,
    };
    axios
      .post("http://localhost:8070/resignation/addempRes", newResignation)
      .then((res) => {
        alert("Resignation Added Successfully!✅");
        setsubmitted(true);
        setempID("");
        setreason("");
        setendDate("");
      })
      .catch((err) => {
        alert("Error adding Task: " + err.message);
      });
    console.log(newResignation);
  }

  return (
    <div className="resignation-container">
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Resignation Submitted</h3>
          <p>Your resignation has been successfully submitted.</p>
        </div>
      ) : (
        <>
          <h2>Employee Resignation</h2>
          <form onSubmit={setResignation} className="resignation-form">
            {/* <div className="form-group">
              <label htmlFor="empID">Employee ID:</label>
              <input
                type="text"
                id="empID"
                name="empID"
                placeholder="Enter your employee ID"
                value={empID}
                onChange={(e) => setempID(e.target.value)}
                required
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="lastWorkingDate">Last Working Date:</label>
              <input
                type="date"
                id="lastWorkingDate"
                name="lastWorkingDate"
                value={endDate}
                onChange={(e) => setendDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Resignation:</label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Please provide your reason for resignation"
                value={reason}
                onChange={(e) => setreason(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit Resignation
              </button>
              <button type="button" onClick={() => setsubmitted(false)}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
