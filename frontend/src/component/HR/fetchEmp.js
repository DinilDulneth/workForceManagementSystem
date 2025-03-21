"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "./fetchemp.css"

export default function FetchEmp() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback data to use when API fails
  const fallbackEmployees = [
    {
      _id: "1",
      name: "John Doe",
      position: "Software Engineer",
      department: "Development",
      email: "john.doe@example.com",
      phone: "+94112223344",
      salary: 75000,
      dateOfJoining: "2022-06-15",
      availability: 1,
    },
    {
      _id: "2",
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      email: "jane.smith@example.com",
      phone: "+94112345678",
      salary: 85000,
      dateOfJoining: "2021-03-12",
      availability: 1,
    },
    {
      _id: "3",
      name: "Dinil",
      position: "Software Engineer",
      department: "Development",
      email: "dinil@example.com",
      phone: "0717488137",
      salary: 70000,
      dateOfJoining: "2025-07-01",
      availability: 1,
    },
    {
      _id: "4",
      name: "Samuel Lee",
      position: "UI/UX Designer",
      department: "Design",
      email: "samuel.lee@example.com",
      phone: "+94113456789",
      salary: 65000,
      dateOfJoining: "2023-09-20",
      availability: 1,
    },
    {
      _id: "5",
      name: "Anna Patel",
      position: "Data Scientist",
      department: "Data",
      email: "anna.patel@example.com",
      phone: "+94114567890",
      salary: 95000,
      dateOfJoining: "2020-01-10",
      availability: 0,
    },
    {
      _id: "6",
      name: "Mark Johnson",
      position: "DevOps Engineer",
      department: "Operations",
      email: "mark.johnson@example.com",
      phone: "+94115678901",
      salary: 70000,
      dateOfJoining: "2022-05-25",
      availability: 1,
    },
  ]

  useEffect(() => {
    getEmployee()
  }, [])

  function getEmployee() {
    setLoading(true)
    setError(null)

    // Try to fetch from API with timeout
    const fetchPromise = axios.get("http://localhost:8070/employee/getEmp", {
      timeout: 5000, // 5 second timeout
    })

    // Set a timeout promise
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 5000))

    // Race between fetch and timeout
    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setEmployees(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching employees:", err)
        setError("Could not connect to the server. Using sample data instead.")
        // Use fallback data when API fails
        setEmployees(fallbackEmployees)
        setLoading(false)
      })
  }

  // Function to retry API call
  const handleRetry = () => {
    getEmployee()
  }

  // Function to determine status class
  const getStatusClass = (status) => {
    return status === "1" || status === 1 ? "status-active" : "status-inactive"
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Employees data</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading employee data...</p>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <p>Employees data</p>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Note:</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          <div className="mt-2">
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <div className="row">
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
                        <strong>Salary:</strong> ${employee.salary.toLocaleString()}
                      </p>
                      <p>
                        <strong>Joined:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Email:</strong> {employee.email}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-indicator ${getStatusClass(employee.availability)}`}></span>
                        {employee.availability === "1" || employee.availability === 1 ? "Active" : "Inactive"}
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
  )
}

