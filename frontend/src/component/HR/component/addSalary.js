import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddSalary() {
  const navigate = useNavigate();
  const [salary, setSalary] = useState({
    name: "",
    employeeId: "",
    paidHours: "",
    grossPay: "",
    statutoryPay:"",
    deductions: "",
    netPay: "",
    status: "Pending",
  });

  function addSalaryData(e) {
    e.preventDefault();

    // Convert numeric fields to numbers
    const salaryData = {
      ...salary,
      paidHours: Number(salary.paidHours) || 0,
      grossPay: Number(salary.grossPay) || 0,
      deductions: Number(salary.deductions) || 0,
      netPay: Number(salary.netPay) || 0,
    };

    console.log("Submitting Salary Data:", salaryData); // Debugging

    axios
      .post("http://localhost:8070/salary/add", salaryData)
      .then(() => {
        alert("Salary Added Successfully! ✅");
        navigate("/fetchSalary");
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        alert("Error adding salary: " + (err.response?.data?.message || err.message));
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setSalary({
      ...salary,
      [name]: value,
    });
  }

  return (
    <form
      className="container mt-4"
      onSubmit={addSalaryData}
      style={{
        maxWidth: "600px",
        padding: "2rem",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ color: "#ff7043", fontWeight: "bold" }}>Add Salary</h2>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Name"
          name="name"
          value={salary.name}
          onChange={handleChange}
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
          name="employeeId"
          value={salary.employeeId}
          onChange={handleChange}
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
          type="number"
          className="form-control"
          placeholder="Paid Hours"
          name="paidHours"
          value={salary.paidHours}
          onChange={handleChange}
          style={{
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            border: "2px solid #e0e0e0",
          }}
        />
      </div>
      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "600", color: "#455a64" }}>statutoryPay</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter statutoryPay"
          name="statutoryPay"
          value={salary.statutoryPay}
          onChange={handleChange}
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
          type="number"
          className="form-control"
          placeholder="Gross Pay"
          name="grossPay"
          value={salary.grossPay}
          onChange={handleChange}
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
          type="number"
          className="form-control"
          placeholder="Deductions"
          name="deductions"
          value={salary.deductions}
          onChange={handleChange}
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
          type="number"
          className="form-control"
          placeholder="Net Pay"
          name="netPay"
          value={salary.netPay}
          onChange={handleChange}
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
          name="salaryStatus"
          value={salary.status}
          onChange={handleChange}
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
        Add
      </button>
    </form>
  );
}
