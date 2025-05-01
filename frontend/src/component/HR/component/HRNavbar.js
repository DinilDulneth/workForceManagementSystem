import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaCalendarAlt, FaChartBar } from "react-icons/fa";

export default function HRNavbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className="sidebar">
            <div className="logo-details">
                <i className="bx bxl-c-plus-plus"></i>
                <span className="logo_name">HR Dashboard</span>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/HRDashboard" className={isActive("/HRDashboard")}>
                        <FaHome className="bx" />
                        <span className="link_name">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/HRDashboard/employees" className={isActive("/HRDashboard/employees")}>
                        <FaUser className="bx" />
                        <span className="link_name">Employees</span>
                    </Link>
                </li>
                <li>
                    <Link to="/HRDashboard/approved-leaves" className={isActive("/HRDashboard/approved-leaves")}>
                        <FaCalendarAlt className="bx" />
                        <span className="link_name">Approved Leaves</span>
                    </Link>
                </li>
                <li>
                    <Link to="/HRDashboard/reports" className={isActive("/HRDashboard/reports")}>
                        <FaChartBar className="bx" />
                        <span className="link_name">Reports</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
} 