import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Manager/component/MDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import defaultProfilePic from "../assets/images/user_img.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardTemp({ ArrLinkList }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Retrieve user data from localStorage
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name");
  const role = localStorage.getItem("role");
  const ID = localStorage.getItem("ID");

  useEffect(() => {
    // Check if the user is authenticated
    if (!email || !name) {
      toast.error("Unauthorized access! Please log in to continue...", {
        position: "top-right",
        autoClose: 1000
      });

      setTimeout(() => {
        window.location.href = "/UserLogin";
      }, 3000);
    } else {
      // Show success notification after login
      toast.success(`Welcome back, ${name}!`, {
        position: "top-right",
        autoClose: 3000
      });
    }
  }, [email, name]);

  // Use the custom authentication hook
  // const isAuthenticated = useAuth(email, name);

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  // Handle Logout
  const handleLogout = (e) => {
    e.preventDefault();

    // Clear user data and token
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("Name");
    localStorage.removeItem("role");
    localStorage.removeItem("ID");

    // Show logout notification
    toast.info("You have been logged out.", {
      position: "top-right",
      autoClose: 1000
    });

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "/UserLogin";
    }, 2000);
  };

  return (
    <>
      <ToastContainer /> {/* ToastContainer for notifications */}
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
            {/* <div className="dropdown">
              <span className="me-2">{name}</span>
              <a
                href="/UserLogin"
                className="dropdown-item text-danger d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </a>
            </div> */}

            <div className="dropdown">
              <span className="me-2">{name}</span>
              <a
                href="#"
                onClick={handleLogout}
                className="dropdown-item text-danger d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </a>
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
                to="/ManagerDashboard/MyCalendar"
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
