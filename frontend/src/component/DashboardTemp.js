import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Manager/component/MDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import defaultProfilePic from "../assets/images/user_img.jpg";
import Chart, { Colors } from "chart.js/auto";

export default function DashboardTemp({ ArrLinkList }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

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
  // Get values from localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name"); // If your backend provides this
  const role = localStorage.getItem("role");
  const ID = localStorage.getItem("ID");
  const userInfo = decodeToken(token);

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Initialize Chart.js
  useEffect(() => {
    const ctx = document.getElementById("revenueChart")?.getContext("2d");
    if (!ctx) return;
  }, []);
  const profilePic = "/frontend/media/image/user_img.jpg";
  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container-fluid">
          <Link
            className="navbar-brand fw-bold"
            style={{ color: "#ff6600", fontSize: "28px" }}
            to="/ManagerDashboard/"
          >
            WorkSync
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-flex ms-auto align-items-center">
            {/* Profile Picture with Styles */}
            <div style={{ marginRight: "13px" }} className="position-relative">
              <img
                src={defaultProfilePic}
                alt="Profile"
                className="rounded-circle border border-2 border-primary shadow-sm mr-3"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover"
                }}
              />
              {/* Online Status Badge */}
              <span
                className="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-light rounded-circle"
                style={{ width: "10px", height: "10px" }}
              ></span>
            </div>
            <div className="dropdown">
              <span className="me-2">{name}</span>
              <a
                href="/UserLogin"
                className="dropdown-item text-danger d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </a>

              {/* <ul className="dropdown-menu dropdown-menu-end">
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
              </ul> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        id="sidebar"
      >
        <ul
          className="nav flex-column mt-3"
          style={{ height: "96%", display: "flex", flexDirection: "column" }}
        >
          {/* Top Menu */}
          <li className="nav-item">
            <div className="menuIcon">
              <span className="menuIcon">Menu</span>
            </div>
          </li>
          {ArrLinkList.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                className={`nav-link ${
                  location.pathname === item.link ? "active" : ""
                }`}
                to={item.link}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          {/* <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/ManagerDashboard/" ||
                location.pathname === "/ManagerDashboard"
                  ? "active"
                  : ""
              }`}
              to="/ManagerDashboard/"
            >
              <i className="bi bi-house-door me-2"></i>
              <span>Dashboard</span>
            </Link>
          </li> */}
          {/* Bottom Section with Icons Only */}
          <div className="mt-auto">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Link
                className={`nav-link ${
                  location.pathname === "/help" ? "active" : ""
                }`}
                to="/help"
                title="Help & Support"
              >
                <i className="bi bi-question-circle"></i>
              </Link>

              <Link
                className={`nav-link ${
                  location.pathname === "/notifications" ? "active" : ""
                }`}
                to="/notifications"
                title="Notifications"
              >
                <i className="bi bi-bell"></i>
              </Link>

              <Link
                className={`nav-link ${
                  location.pathname === "/calendar" ? "active" : ""
                }`}
                to="/calendar"
                title="Calendar"
              >
                <i className="bi bi-calendar"></i>
              </Link>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}
