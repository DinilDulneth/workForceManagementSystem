import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaUserCircle,
  FaCog,
  FaBars,
  FaBell
} from "react-icons/fa";

const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const decodedToken = jwtDecode(token);
    // Adjust these based on your actual token payload structure
    const userId = decodedToken.sub || decodedToken.email;
    const userName = decodedToken.name || decodedToken.email;
    return { userId, userName };
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return null;
  }
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get values from localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name"); // If your backend provides this
  const role = localStorage.getItem("role");
  const ID = localStorage.getItem("ID");
  const userInfo = decodeToken(token);

  console.log(`User ID:${ID}`);
  console.log(`User Name:${name}`);
  console.log(`User Email:${email}`);

  // Check if user is authenticated and has correct role
  if (!userInfo || role !== "Employee") {
    // Redirect to login if token is invalid or role doesn't match
    navigate("/login");
    return null;
  }

  return (
    <div className="d-flex">
      <style>
        {`
          :root {
            --primary-orange: #ff7043;
            --primary-orange-dark: #e64a19;
            --secondary-grey: #455a64;
            --light-grey: #eceff1;
            --white: #ffffff;
            --text-dark: #263238;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .navbar-custom {
            background: linear-gradient(135deg, #ff7043 0%, #ff5722 100%);
            box-shadow: var(--shadow);
          }

          .btn-custom-primary {
            background-color: var(--primary-orange);
            border-color: var(--primary-orange);
            color: var(--white);
          }

          .btn-custom-primary:hover {
            background-color: var(--primary-orange-dark);
            border-color: var(--primary-orange-dark);
            color: var(--white);
          }

          .card-custom {
            border: none;
            box-shadow: var(--shadow);
            border-radius: 8px;
          }

          .card-header-custom {
            background-color: var(--white);
            border-bottom: 2px solid var(--light-grey);
            padding: 1.5rem;
          }

          .sidebar {
            width: 250px;
            min-height: 100vh;
            background: white;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .sidebar.collapsed {
            width: 80px;
          }

          .main-content {
            min-height: 100vh;
            background: #f8f9fa;
            margin-left: 250px;
            padding: 2rem;
          }

          .nav-link {
            color: #455a64;
            transition: all 0.3s ease;
          }

          .nav-link:hover,
          .nav-link.active {
            color: #ff7043 !important;
            background: rgba(255, 112, 67, 0.1);
            border-radius: 8px;
          }

          .text-orange {
            color: #ff7043;
          }

          .leave-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border: none;
            overflow: hidden;
          }

          .leave-card .card-header {
            background: linear-gradient(135deg, #ff7043 0%, #ff5722 100%);
            color: white;
            border: none;
            padding: 1.5rem;
          }

          .leave-form-container {
            padding: 2rem;
          }

          .form-control,
          .form-select {
            border-radius: 8px;
            padding: 0.75rem 1rem;
            border: 2px solid #e0e0e0;
            transition: all 0.3s ease;
          }

          .form-control:focus,
          .form-select:focus {
            border-color: #ff7043;
            box-shadow: 0 0 0 0.2rem rgba(255, 112, 67, 0.25);
          }

          .form-label {
            font-weight: 600;
            color: #455a64;
            margin-bottom: 0.5rem;
          }

          .btn-leave-primary {
            background: #ff7043;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-leave-primary:hover {
            background: #ff5722;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 112, 67, 0.4);
          }

          .btn-leave-secondary {
            background: #455a64;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-leave-secondary:hover {
            background: #37474f;
            transform: translateY(-2px);
          }

          .leave-table {
            border-radius: 10px;
            overflow: hidden;
          }

          .leave-table thead th {
            background: #455a64;
            color: white;
            padding: 1rem;
            font-weight: 600;
          }

          .leave-table tbody td {
            padding: 1rem;
            vertical-align: middle;
          }

          .leave-table tbody tr {
            transition: all 0.3s ease;
          }

          .leave-table tbody tr:hover {
            background-color: #f5f5f5;
          }

          .badge-leave-status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            min-width: 100px;
            text-align: center;
          }

          .invalid-feedback {
            font-size: 0.85rem;
            margin-top: 0.5rem;
            font-weight: 500;
          }

          .loading-spinner {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.5rem;
          }

          .btn-group .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .badge {
            padding: 0.5rem 1rem;
            font-weight: 500;
          }

          .btn-sm svg {
            width: 14px;
            height: 14px;
          }
        `}
      </style>
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-0 text-orange">WorkSync</h4>
            <button
              className="btn btn-link"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              <FaBars size={20} color="#ff7043" />
            </button>
          </div>
          <div className="nav flex-column">
            <Link
              to="#"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaHome className="me-2" /> Dashboard
            </Link>
            {/* <Link
              to="/EmployeeDashboard/leaves"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaCalendarAlt className="me-2" /> Leave Management
            </Link> */}
            <Link
              to="/EmployeeDashboard/ResignationF"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Resignation Form
            </Link>

            <Link
              to="/EmployeeDashboard/ResignationV"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Resignation View
            </Link>
            <Link
              to="/EmployeeDashboard/ResignationD"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Resignation Delete
            </Link>
            <Link
              to="/EmployeeDashboard/addInquiry"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> add Inquiry
            </Link>
            <Link
              to="/EmployeeDashboard/LeaveRequest"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Leave Request
            </Link>
            <Link
              to="/EmployeeDashboard/FetchFeedback"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Fetch Feedback
            </Link>
            <Link
              to="/EmployeeDashboard/Fetchinquiry"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> Fetch inquiry
            </Link>
            <Link
              to="/EmployeeDashboard/addInquiry"
              className="nav-link d-flex align-items-center text-secondary mb-2"
            >
              <FaUserCircle className="me-2" /> add Inquiry
            </Link>

            <a
              href="#"
              className="nav-link d-flex align-items-center text-secondary"
            >
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
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Logout
                    </a>
                  </li>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
