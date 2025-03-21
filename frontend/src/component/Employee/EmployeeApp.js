import React from 'react';
import { BrowserRouter as Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeDashboardNavbar from './EmployeeDashboardNavBar';
import LeaveRequest from './LeaveRequest';

function EmployeeApp() {
    return (
        <Routes>
            <EmployeeDashboardNavbar />
            <Route path="/" element={<LeaveRequest />} />
        </Routes>
    );
}

export default EmployeeApp;
