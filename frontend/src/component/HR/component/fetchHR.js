import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchHR() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHR();
  }, []);

  function getHR() {
    setLoading(true);
    setError(null);

    // Try to fetch from API with timeout
    const fetchPromise = axios.get(
      "http://localhost:8070/Hregistration/getHR",
      {
        timeout: 5000, // 5 second timeout
      }
    );

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
        console.error("Error fetching HR employees:", err);
        setError("Could not connect to the server. Using sample data instead.");
        setLoading(false);
      });
  }

  // Function to retry API call
  const handleRetry = () => {
    getHR();
  };

  // Function to determine status class
  const getStatusClass = (status) => {
    return status === "1" || status === 1 ? "status-active" : "status-inactive";
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginTop: "5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "28px",
            fontWeight: 500,
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          HR Employees data
        </p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "3rem" }}>Loading HR employee data...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        marginTop: "5rem",
        marginBottom: "5rem",
      }}
    >
      <p
        style={{
          fontSize: "28px",
          fontWeight: 500,
          textAlign: "center",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        HR Employees data
      </p>

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
          <div style={{ marginTop: "2rem" }}>
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <div className="row mb-5">
        {employees.map((employee) => (
          <div className="col-md-4 mb-4" key={employee._id}>
            <div
              className="employee-card"
              style={{
                transition: "all 0.3s ease",
                height: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                className="card"
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "100%",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="card-header text-white"
                  style={{
                    backgroundColor: "#ff7043",
                    padding: "15px",
                    fontWeight: "bold",
                    borderBottom: "none",
                  }}
                >
                  <h6 className="mb-0">{employee.name}</h6>
                </div>
                <div
                  className="card-body"
                  style={{
                    padding: "20px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div className="row">
                    <div className="col-md-12">
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Position:
                        </strong>{" "}
                        {employee.position}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Department:
                        </strong>{" "}
                        {employee.department}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Phone:
                        </strong>{" "}
                        {employee.phone}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Salary:
                        </strong>{" "}
                        $
                        {employee.salary
                          ? employee.salary.toLocaleString()
                          : "N/A"}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Joined:
                        </strong>{" "}
                        {employee.dateOfJoining
                          ? new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Email:
                        </strong>{" "}
                        {employee.email}
                      </p>
                      <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                        <strong
                          style={{
                            fontWeight: 600,
                            display: "inline-block",
                            width: "85px",
                          }}
                        >
                          Status:
                        </strong>{" "}
                        <span
                          className={`status-indicator ${getStatusClass(
                            employee.availability
                          )}`}
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            marginRight: "5px",
                          }}
                        ></span>
                        {employee.availability === "1" ||
                        employee.availability === 1
                          ? "Active"
                          : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
