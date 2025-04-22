import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchManager() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getManagers();
  }, []);

  function getManagers() {
    setLoading(true);
    setError(null);

    const fetchPromise = axios.get("http://localhost:8070/manager/getManager", {
      timeout: 5000
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching managers:", err);
        setError("Could not connect to the server. Using sample data instead.");
        setLoading(false);
      });
  }

  const handleRetry = () => {
    getManagers();
  };

  const getStatusClass = (status) => {
    return status === "1" || status === 1 ? "status-active" : "status-inactive";
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <p style={styles.title}>Manager Employees Data</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={styles.loadingText}>Loading manager employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Manager Employees Data</h2>

        {error && (
          <div style={styles.alert} className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Note:</strong> {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <div style={styles.retryButtonContainer}>
              <button className="btn btn-sm btn-primary" onClick={handleRetry}>
                Retry Connection
              </button>
            </div>
          </div>
        )}

        <div style={styles.cardGrid}>
          {employees.map((employee) => (
            <div key={employee._id} style={styles.employeeCard}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h6 style={styles.cardHeaderText}>{employee.name}</h6>
                </div>
                <div style={styles.cardBody}>
                  {cardFields.map((field) => (
                    <p key={field.label} style={styles.cardField}>
                      <strong style={styles.fieldLabel}>{field.label}:</strong>{" "}
                      {field.getValue(employee)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardFields = [
  { label: 'Position', getValue: (emp) => emp.position },
  { label: 'Department', getValue: (emp) => emp.department },
  { label: 'Phone', getValue: (emp) => emp.phone },
  { label: 'Salary', getValue: (emp) => `$${emp.salary ? emp.salary.toLocaleString() : 'N/A'}` },
  { label: 'Joined', getValue: (emp) => emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A' },
  { label: 'Email', getValue: (emp) => emp.email },
  { 
    label: 'Status', 
    getValue: (emp) => (
      <span>
        <span 
          className={`status-indicator ${emp.availability === "1" || emp.availability === 1 ? "status-active" : "status-inactive"}`} 
          style={styles.statusIndicator}
        ></span>
        {emp.availability === "1" || emp.availability === 1 ? "Active" : "Inactive"}
      </span>
    )
  }
];

const styles = {
  pageContainer: {
    marginLeft: "250px", // Match sidebar width
    padding: "20px",
    transition: "margin-left 0.3s ease",
    width: "calc(100% - 250px)",
    minHeight: "calc(100vh - 60px)", // Account for navbar height
    backgroundColor: "#f5f5f5",
    marginTop: "60px" // Account for navbar height
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },
  loadingContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "2rem",
    textAlign: "center"
  },
  title: {
    fontSize: "28px",
    fontWeight: 500,
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  loadingText: {
    marginTop: "3rem",
    color: "#666"
  },
  alert: {
    marginBottom: "20px"
  },
  retryButtonContainer: {
    marginTop: "2rem"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0"
  },
  employeeCard: {
    transition: "transform 0.3s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)"
    }
  },
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    height: "100%",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#fff"
  },
  cardHeader: {
    backgroundColor: "#ff7043",
    padding: "15px",
    borderBottom: "none"
  },
  cardHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    margin: 0
  },
  cardBody: {
    padding: "20px"
  },
  cardField: {
    marginBottom: "8px",
    fontSize: "14px"
  },
  fieldLabel: {
    fontWeight: 600,
    display: "inline-block",
    width: "85px"
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px",
    backgroundColor: "currentColor"
  }
};