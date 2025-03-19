import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Chart from "chart.js/auto";

export default function MDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Initialize Chart.js
  useEffect(() => {
    const ctx = document.getElementById("revenueChart")?.getContext("2d");
    if (!ctx) return;
  }, []);

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            Dashboard
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-flex ms-auto align-items-center">
            <div className="dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="me-2">User Name</span>
                <img
                  src="https://via.placeholder.com/30"
                  alt="User Avatar"
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item text-danger" to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        id="sidebar"
      >
        <ul className="nav flex-column mt-3">
          <li className="nav-item">
            <div className="menuIcon" onClick={toggleSidebar}>
              <i className="bi bi-list me-2"></i>
              <span className="menuIcon">Menu</span>
            </div>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
              to="/"
            >
              <i className="bi bi-house-door me-2"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/analytics" ? "active" : ""
              }`}
              to="/analytics"
            >
              <i className="bi bi-bar-chart me-2"></i>
              <span>Progress Analytics</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/empAll" ? "active" : ""
              }`}
              to="/empAll"
            >
              <i className="bi bi-people me-2"></i>
              <span>Handling Employees</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/manageTask" ? "active" : ""
              }`}
              to="/manageTask"
            >
              <i className="bi bi-card-checklist me-2"></i>
              <span>Manage Task</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/settings" ? "active" : ""
              }`}
              to="/settings"
            >
              <i className="bi bi-gear me-2"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
