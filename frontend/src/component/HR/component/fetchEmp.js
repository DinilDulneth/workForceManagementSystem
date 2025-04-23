import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchEmp() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEmployee();
  }, []);

  function getEmployee() {
    setLoading(true);
    setError(null);

    // Try to fetch from API with timeout
    const fetchPromise = axios.get("http://localhost:8070/employee/getEmp", {
      timeout: 5000 // 5 second timeout
    });

    // Set a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    // Race between fetch and timeout
    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setError("Could not connect to the server. Using sample data instead.");
        setLoading(false);
      });
  }

  // Function to retry API call
  const handleRetry = () => {
    getEmployee();
  };

  // Function to determine status class
  const getStatusClass = (status) => {
    return status === "1" || status === 1 ? "status-active" : "status-inactive";
  };

  if (loading) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.loadingContainer}>
          <h3 style={styles.header}>
            Employees Data
            <span style={styles.headerUnderline}></span>
          </h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "20px", color: "#666" }}>
            Loading employee data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <h2 style={styles.header}>
        Employees Data
        <span style={styles.headerUnderline}></span>
      </h2>

      {error && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Note:</strong> {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
          <div className="mt-2">
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <div style={styles.cardContainer}>
        {employees.map((employee) => (
          <div
            key={employee._id}
            style={styles.employeeCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={styles.cardHeader}>
              <h6 style={{ margin: 0 }}>{employee.name}</h6>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Position:</strong>{" "}
                {employee.position}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Department:</strong>{" "}
                {employee.department}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Phone:</strong>{" "}
                {employee.phone}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Salary:</strong> $
                {employee.salary?.toLocaleString() || "N/A"}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Joined:</strong>{" "}
                {employee.dateOfJoining
                  ? new Date(employee.dateOfJoining).toLocaleDateString()
                  : "N/A"}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Email:</strong>{" "}
                {employee.email}
              </p>
              <p style={styles.infoRow}>
                <strong style={styles.infoLabel}>Status:</strong>{" "}
                <span
                  style={{
                    ...styles.statusIndicator,
                    backgroundColor:
                      employee.availability === "1" ||
                      employee.availability === 1
                        ? "#2ecc71"
                        : "#e74c3c"
                  }}
                ></span>
                {employee.availability === "1" || employee.availability === 1
                  ? "Active"
                  : "Inactive"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    maxWidth: "calc(100vw - 250px)",
    backgroundColor: "#f8f9fa"
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "1.8rem",
    position: "relative",
    paddingBottom: "15px"
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    backgroundColor: "#fc6625"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px"
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    overflow: "hidden"
  },
  cardHeader: {
    backgroundColor: "#fc6625",
    color: "#ffffff",
    padding: "15px",
    fontWeight: "bold"
  },
  cardBody: {
    padding: "20px"
  },
  infoRow: {
    marginBottom: "8px",
    fontSize: "14px"
  },
  infoLabel: {
    fontWeight: 600,
    display: "inline-block",
    width: "85px",
    color: "#2c3e50"
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)"
  }
};
