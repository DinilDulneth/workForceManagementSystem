import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import UserLogin from "./component/UserLogin";
import UserRegister from "./component/UserRegister";
import Index from "./component/Home";
import EmployeeApp from "./component/Employee/EmployeeApp";
import About from "./component/About";
import ContactUs from "./component/ContactUs";
import ManagerApp from "./component/Manager/ManagerApp";
import LeaveApproval from './component/Manager/component/LeaveApproval';
import LeaveRequest from './component/Employee/LeaveRequest';
import HRDashboard from './components/HR/Dashboard/HRDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/employee" replace />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/Register" element={<UserRegister />} />
        <Route path="/HRDashboard/*" element={<HRDashboard />} />
        <Route path="/ManagerDashboard/*" element={<ManagerApp />} />
        <Route path="/EmployeeDashboard/*" element={<EmployeeApp />} />
        <Route path="/About" element={<About />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/employee" element={<EmployeeApp />}>
          <Route path="leaves" element={<LeaveRequest />} />
        </Route>
        <Route path="/manager/leaves" element={<LeaveApproval />} />
      </Routes>
    </Router>
  );
}

export default App;
