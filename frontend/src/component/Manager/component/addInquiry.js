import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddInquiry() {
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [sender, setSender] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState(""); // New state for department

  useEffect(() => {
    setDate(new Date().toISOString());
    const userId = getCurrentUserId();
    setSender(userId);
  }, []);

  function getCurrentUserId() {
    // Replace this with your actual method to get the user ID
    return "605c72ef2f799e2a4c8b4567"; // Example user ID
  }

  function sendInquiryData(e) {
    e.preventDefault(); // Prevents form from reloading

    const newInquiry = {
      employeeId,
      inquiry,
      sender,
      date,
      department, // Add department to the inquiry object
    };

    axios
      .post("http://localhost:8070/api/inquiry/addInquiry", newInquiry)
      .then(() => {
        alert("Inquiry Added Successfully! ✅");
        setEmployeeId("");
        setInquiry("");
        setSender("");
        setDate("");
        setDepartment(""); // Reset department after submission
        navigate("/fetchInquiry");
      })
      .catch((err) => {
        alert("Error adding Inquiry: " + err.message);
      });

    console.log(newInquiry);
  }

  return (
    <form className="container mt-4" onSubmit={sendInquiryData}>
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
        <label htmlFor="exampleInputInquiry">Inquiry</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputInquiry"
          placeholder="Enter Inquiry"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="departmentSelect">Select Department</label>
        <select
          className="form-control"
          id="departmentSelect"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="General Manager">General Manager</option>
        </select>
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
        Submit Inquiry
      </button>
    </form>
  );
}
