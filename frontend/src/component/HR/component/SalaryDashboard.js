import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./SalaryDashboard.css"; // Updated CSS file

const SalaryDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8070/api/salaries")
      .then((res) => setSalaries(res.data))
      .catch((err) => console.error("Error fetching salaries:", err));
  }, []);

  const deleteSalary = (id) => {
    axios.delete(`http://localhost:8070/api/salaries/${id}`)
      .then(() => setSalaries(salaries.filter((salary) => salary._id !== id)))
      .catch((err) => console.error("Error deleting salary:", err));
  };

  return (
    <div className="salary-container">
      <h2>Salary Management</h2>
      <input 
        type="text" 
        placeholder="Search Salary Record" 
        className="search-bar" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary No.</th>
            <th>Paid Hours</th>
            <th>Gross Pay</th>
            <th>Statutory Pay</th>
            <th>Deductions</th>
            <th>Net Pay</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaries.filter(salary => salary.name.toLowerCase().includes(search.toLowerCase())).map((salary) => (
            <tr key={salary._id}>
              <td>{salary.name}</td>
              <td>{salary.salaryNumber}</td>
              <td>{salary.paidHours}</td>
              <td>${salary.grossPay}</td>
              <td>${salary.statutoryPay}</td>
              <td className="deduction">-${salary.deductions}</td>
              <td className="net-pay">${salary.netPay}</td>
              <td className={`status ${salary.status.toLowerCase()}`}>{salary.status}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteSalary(salary._id)}>Delete</button>
                <button className="update-btn">Update</button> {/* Update logic to be added */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryDashboard;
