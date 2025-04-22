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
    <div className="">
      {/* <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
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
      </div> */}

      {/* Main Content */}
      {/* <div className="main-content w-100"> */}
      {/* Navbar */}
      {/* <nav className="navbar navbar-expand-lg navbar-dark navbar-custom mb-4">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">Employee Dashboard</span>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FaBell size={20} color="white" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </div> */}
      {/* <div className="dropdown">
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
              </div> */}
      {/* </div>
          </div>
        </nav> */}

      {/* Content Area */}
      {/* <div className="container-fluid">
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
        </div> */}
    </div>
    // </div>
  );
}
