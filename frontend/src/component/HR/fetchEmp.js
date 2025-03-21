import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./fetchemp.css";

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
      timeout: 5000, // 5 second timeout
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
        // Use fallback data when API fails
        //setEmployees(fallbackEmployees)
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
      <div className="container mt-5 text-center">
        <p>Employees data</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <p>Employees data</p>

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

      <div className="row mb-5">
        {employees.map((employee) => (
          <div className="col-md-4 mb-4" key={employee._id}>
            <div className="employee-card">
              <div className="card">
                <div className="card-header text-white">
                  <h6 className="mb-0">{employee.name}</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <p>
                        <strong>Position:</strong> {employee.position}
                      </p>
                      <p>
                        <strong>Department:</strong> {employee.department}
                      </p>
                      <p>
                        <strong>Phone:</strong> {employee.phone}
                      </p>
                      <p>
                        <strong>Salary:</strong> $
                        {employee.salary
                          ? employee.salary.toLocaleString()
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Joined:</strong>{" "}
                        {employee.dateOfJoining
                          ? new Date(
                              employee.dateOfJoining
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {employee.email}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-indicator ${getStatusClass(
                            employee.availability
                          )}`}
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
