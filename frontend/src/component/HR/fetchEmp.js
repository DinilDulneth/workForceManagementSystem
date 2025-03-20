import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchEmp() {
  const [employees, setEmployees] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    getEmployee();
  }, []);

  function getEmployee() {
    axios
      .get("http://localhost:8070/employee/getEmp")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      });
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {employees.map((employee) => (
          <React.Fragment key={employee._id}>
            <div
              className={`col-md-4 mb-4 ${
                expandedCard === employee._id ? "d-none" : ""
              }`}
            >
              <div
                className={`employee-card ${
                  expandedCard === employee._id ? "d-none" : ""
                }`}
              >
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">{employee.name}</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Position:</strong> {employee.position}
                        </p>
                        <p>
                          <strong>Department:</strong> {employee.department}
                        </p>
                        <p>
                          <strong>Email:</strong> {employee.email}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Phone:</strong> {employee.phone}
                        </p>
                        <p>
                          <strong>Salary:</strong> $
                          {employee.salary.toLocaleString()}
                        </p>
                        <p>
                          <strong>Joined:</strong>{" "}
                          {new Date(
                            employee.dateOfJoining
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {employee.availability}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
