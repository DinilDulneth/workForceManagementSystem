import React from "react";

export default function DashboardHR() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Sidebar */}
      {/* <div
        style={{
          width: "250px",
          backgroundColor: "#474747",
          color: "#ffffff",
          padding: "20px"
        }}
      >
        <h2 style={{ color: "#fc6625" }}>WorkSync</h2>
        <nav>
          <a href="#" style={linkStyle}>
            Dashboard
          </a>
          <a href="/HRDashboard/FetchEmp" style={linkStyle}>
            Employees
          </a>
          <a href="/HRDashboard/ResignationVemp" style={linkStyle}>
            Resignation View
          </a>
          <a href="/HRDashboard/UserRegister" style={linkStyle}>
            User Registration
          </a>
          <a href="/HRDashboard/ManagerRegistration" style={linkStyle}>
            Manager Registration
          </a>
          <a href="/HRDashboard/fetchManager" style={linkStyle}>
            View Manager
          </a>
          <a href="/HRDashboard/HRRegistration" style={linkStyle}>
            HR Registration
          </a>
          <a href="/HRDashboard/FetchHR" style={linkStyle}>
            HR Records
          </a>
          <a href="/HRDashboard/RegistrationDemo" style={linkStyle}>
            Delete Employee Account
          </a>
          <a href="/HRDashboard/RegistrationUemo" style={linkStyle}>
            Edit Employee Account
          </a>
          <a href="/HRDashboard/RegistrationVemo" style={linkStyle}>
            View Employee Account
          </a>
          <a href="/HRDashboard/addSalary" style={linkStyle}>
            Add Salary
          </a>
          <a href="/HRDashboard/fetchSalary" style={linkStyle}>
            view Salary
          </a>
          <a href="/HRDashboard/addSalary" style={linkStyle}>
            Add Salary
          </a>
          <a href="/HRDashboard/SalaryDashboard" style={linkStyle}>
            Salary Dashboard
          </a>
          <a href="../../UserLogin" style={linkStyle}>
            Sign Out
          </a>
        </nav>
      </div> */}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#ffffff" }}>
        <h2 style={{ color: "#000000" }}>Welcome back, HR Manager! 👋</h2>

        {/* Attendance Overview */}
        <div style={cardStyle}>
          <h3>Attendance Overview</h3>
          <p>Chart Placeholder</p>
        </div>

        {/* Candidate List */}
        <div style={cardStyle}>
          <h3>Candidate List</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Job Applied</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tableRowStyle}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr style={tableRowStyle}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr style={tableRowStyle}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Styles
const linkStyle = {
  display: "block",
  color: "#ffffff",
  textDecoration: "none",
  padding: "10px 0"
};

const cardStyle = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
};

const tableHeaderStyle = {
  backgroundColor: "#fc6625",
  color: "#ffffff",
  padding: "10px",
  textAlign: "left"
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px"
};
