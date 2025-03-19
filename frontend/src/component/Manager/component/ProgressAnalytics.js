import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./ProgressAnalytics.css";

export default function ProgressAnalytics() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getEmployee();
  }, []);

  function getEmployee() {
    axios
      .get("http://localhost:8070/employee/getEmp")
      .then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      });
  }

  const handleViewProgress = (id) => {
    navigate(`/ManagerDashboard/progress/${id}`); // Corrected navigation
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.position &&
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.status &&
        employee.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="container py-6 main-block">
        <h2 className="headerName mb-5">Team Progress</h2>
        <div className="mb-4 position-relative search_c">
          <div className="search-wrapper">
            <input
              type="text"
              className="form-control shadow-sm border-0 rounded-pill py-3 px-4 shadow-lg p-3 mb-5 bg-body-tertiary rounded"
              placeholder="Search employees by name, position, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredEmployees.map((employee) => (
            <React.Fragment key={employee._id}>
              <div className="col employeedetails">
                <div className="employee-card">
                  <div className="card-header">
                    <h6 className="mb-0 p-0">{employee.name}</h6>
                  </div>
                  <div className="employee-img-container">
                    <img
                      src={employee.image || "../../media/image/user_img.jpg"}
                      className="employee-img"
                      alt={employee.name}
                    />
                  </div>
                  <div className="card-body">
                    <p className="card-text mb-2">
                      <i className="fas fa-user-tie info-icon"></i>
                      <strong>Role:</strong> {employee.position}
                    </p>
                    <p className="card-text mb-2">
                      <i className="fas fa-envelope info-icon"></i>
                      <strong>Email:</strong> {employee.email}
                    </p>
                    <p className="card-text">
                      <i className="fas fa-circle-notch info-icon"></i>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-dot ${
                          employee.status === "Active" ? "" : "status-offline"
                        }`}
                      ></span>{" "}
                      {employee.status}
                    </p>
                  </div>
                  <div className="card-footer text-center border-0">
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleViewProgress(employee._id)}
                    >
                      <i className="bi bi-eye"></i>
                      View Progress
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
