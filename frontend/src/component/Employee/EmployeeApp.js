import React, { useState } from "react";
import LeaveRequest from "../LeaveRequest";
import {
  FaHome,
  FaCalendarAlt,
  FaUserCircle,
  FaCog,
  FaBars,
  FaBell
} from 'react-icons/fa';
import '../../styles/custom.css';

export default function EmployeeApp() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-0 text-orange">WorkForce</h4>
            <button
              className="btn btn-link"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              <FaBars size={20} color="#ff7043" />
            </button>
          </div>
          <div className="nav flex-column">
            <a href="#" className="nav-link d-flex align-items-center text-secondary mb-2">
              <FaHome className="me-2" /> Dashboard
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-secondary mb-2 active">
              <FaCalendarAlt className="me-2" /> Leave Management
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-secondary mb-2">
              <FaUserCircle className="me-2" /> Profile
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-secondary">
              <FaCog className="me-2" /> Settings
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content w-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom mb-4">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">Employee Dashboard</span>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FaBell size={20} color="white" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-link dropdown-toggle text-white text-decoration-none"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={20} className="me-2" />
                  John Doe
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Leave Management</h2>
                <div className="d-flex gap-2">
                  <button className="btn btn-custom-primary">
                    <FaCalendarAlt className="me-2" />
                    View Calendar
                  </button>
                </div>
              </div>
              <LeaveRequest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
