import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FetchSalary() {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    getSalary(); // ✅ Call the function inside useEffect
  }, []); // ✅ Empty dependency array ensures useEffect runs only once on component mount

  function getSalary() {
    axios
      .get("http://localhost:8070/salary/")
      .then((res) => {
        console.log(res.data);
        setSalaries(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  // Delete Salary by ID
  function deleteSalary(id) {
    axios
      .delete(`http://localhost:8070/salary/delete/${id}`)
      .then(() => {
        alert("Salary deleted successfully");
        setSalaries(salaries.filter((salary) => salary._id !== id)); // Update UI
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "800px", padding: "2rem", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <h2 className="text-center mb-4" style={{ color: "#ff7043", fontWeight: "bold" }}>Salary List</h2>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <ul className="list-group">
            {salaries.map((salary) => (
              <li
                key={salary._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: "8px",
                  padding: "1rem",
                  border: "2px solid #e0e0e0",
                  marginBottom: "1rem",
                  backgroundColor: "#fafafa"
                }}
              >
                <span style={{ color: "#474747" }}>
                  <strong>{salary.name}</strong> - {salary.employeeId} - {salary.paidHours} hrs - {salary.grossPay} - {salary.deductions} - {salary.netPay} - {salary.salaryStatus}
                </span>
                <div>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteSalary(salary._id)}
                    style={{
                      backgroundColor: "#fc6625",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/HRDashboard/updateSalary/${salary._id}`)}
                    style={{
                      backgroundColor: "#ff7043",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
