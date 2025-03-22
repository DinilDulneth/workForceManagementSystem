import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateSalary() {
  const { id } = useParams(); // Get salary ID from URL params
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [paidHours, setPaidHours] = useState("");
  const [grossPay, setGrossPay] = useState("");
  const [deductions, setDeductions] = useState("");
  const [netPay, setNetPay] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    axios
      .get(`http://localhost:8070/salary/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setEmployeeId(data.employeeId);
        setPaidHours(data.paidHours);
        setGrossPay(data.grossPay);
        setDeductions(data.deductions);
        setNetPay(data.netPay);
        setStatus(data.status);
      })
      .catch((err) => {
        alert("Error fetching salary: " + err.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSalary = {
      name,
      employeeId,
      paidHours,
      grossPay: Number(grossPay),
      deductions: Number(deductions),
      netPay: Number(netPay),
      status,
    };

    try {
      await axios.put(`http://localhost:8070/salary/update/${id}`, updatedSalary);
      alert("Salary Updated Successfully! ✅");
      navigate("/HRDashboard/fetchSalary"); // Redirect to salary list after update
    } catch (err) {
      alert("Error updating salary: " + err.message);
    }
  };

  return (
    <form
      className="container mt-4"
      onSubmit={handleSubmit}
      style={{
        maxWidth: "600px",
        padding: "2rem",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ color: "#ff7043", fontWeight: "bold" }}>Update Salary</h2>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Employee ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Paid Hours</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Paid Hours"
          value={paidHours}
          onChange={(e) => setPaidHours(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Gross Pay</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Gross Pay"
          value={grossPay}
          onChange={(e) => setGrossPay(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Deductions</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Deductions"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Net Pay</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Net Pay"
          value={netPay}
          onChange={(e) => setNetPay(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Status</label>
        <select
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn"
        style={{
          backgroundColor: "#ff7043",
          color: "#ffffff",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          fontWeight: "600",
        }}
      >
        Update
      </button>
    </form>
  );
}
