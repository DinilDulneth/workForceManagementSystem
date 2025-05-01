import React, { useEffect, useState } from "react";
import axios from "axios";

const SalaryDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8070/employee")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  return (
    <div className="salary-container" style={styles.container}>
      <h2 style={styles.title}>Employee Management</h2>
      <input 
        type="text" 
        placeholder="Search Employee" 
        className="search-bar"
        style={styles.searchBar} 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(employee => 
                employee.name.toLowerCase().includes(search.toLowerCase()) ||
                employee.department.toLowerCase().includes(search.toLowerCase())
              )
              .map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.ID}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                  <td className={employee.availability === "1" ? "active" : "inactive"}>
                    {employee.availability === "1" ? "Active" : "Inactive"}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginLeft: '250px',
    marginTop: '70px'
  },
  title: {
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center'
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  }
};

export default SalaryDashboard;
