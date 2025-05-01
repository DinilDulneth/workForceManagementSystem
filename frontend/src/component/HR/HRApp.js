import React from "react";
import { Routes, Route } from "react-router-dom";
import FetchEmp from "./component/fetchEmp";
import UserRegister from "./component/UserRegister";
// import DashboardHR from "./component/DashboardHR";
// import SalaryDashboard from "./component/SalaryDashboard";
import FetchSalary from "./component/fetchSalary";
import AddSalary from "./component/addSalary";
import UpdateSalary from "./component/updateSalary";
import FetchHR from "./component/fetchHR";
import FetchManager from "./component/fetchManager";
import HRRegistration from "./component/HRRegistration";
import ManagerRegistration from "./component/ManagerRegistration";
import ResignationDemp from "./component/ResignationDemp";
import ResignationUemp from "./component/ResignationUemp";
import ResignationVemp from "./component/ResignationVemp";
import DashboardTemp from "../../component/DashboardTemp";
import ApprovedLeaves from "./component/ApprovedLeaves";

import FetchInquiry from "./component/fetchinquiry";
import FetchAnnouncement from "./component/fetchAnnouncement";
import AccessF from "./component/accessF";
import AccessV from "./component/accessV";
import AccessUpdate from "./component/accessU";

export default function HRApp() {
  const links = [
    // { link: "/", name: "Dashboard", icon: "bi-house-door" },
    {
      link: "/HRDashboard",
      name: "Access View Table",
      icon: "bi-file-earmark",
    },

    {
      link: "/HRDashboard/AccessF",
      name: "Access Form",
      icon: "bi-file-earmark",
    },

    {
      link: "/HRDashboard/ResignationVemp",
      name: "Resignation View",
      icon: "bi-file-earmark",
    },

    { link: "/HRDashboard/FetchEmp", name: "Employees", icon: "bi-people" },

    {
      link: "/HRDashboard/fetchManager",
      name: "View Manager",
      icon: "bi-person-badge",
    },
    {
      link: "/HRDashboard/fetchInquiry",
      name: "Employee Inquiries",
      icon: "bi-question-circle",
    },
    {
      link: "/HRDashboard/fetchAnnouncement",
      name: "Announcements",
      icon: "bi-megaphone",
    },

    {
      link: "/HRDashboard/FetchHR",
      name: "HR Records",
      icon: "bi-clipboard-data",
    },

    {
      link: "/HRDashboard/UserRegister",
      name: "User Registration",
      icon: "bi-person-plus",
    },
    {
      link: "/HRDashboard/ManagerRegistration",
      name: "Manager Registration",
      icon: "bi-person-workspace",
    },
    {
      link: "/HRDashboard/HRRegistration",
      name: "HR Registration",
      icon: "bi-person-lines-fill",
    },

    {
      link: "/HRDashboard/addSalary",
      name: "Add Salary",
      icon: "bi-cash-coin",
    },
    {
      link: "/HRDashboard/fetchSalary",
      name: "View Salary",
      icon: "bi-wallet2",
    },
    // {
    //   link: "/HRDashboard/SalaryDashboard",
    //   name: "Salary Dashboard",
    //   icon: "bi-bar-chart"
    // },
    {
      link: "/HRDashboard/approved-leaves",
      name: "Approved Leaves",
      icon: "bi-calendar-check",
    },
  ];

  return (
    <div className="d-flex">
      <DashboardTemp ArrLinkList={links} />
      <Routes>
        <Route path="/" element={<AccessV />} />
        <Route path="/FetchEmp" element={<FetchEmp />} />
        <Route path="/fetchHR" element={<FetchHR />} />
        <Route path="/fetchManager" element={<FetchManager />} />
        <Route path="/UserRegister" element={<UserRegister />} />
        <Route path="/HRRegistration" element={<HRRegistration />} />
        <Route path="/ManagerRegistration" element={<ManagerRegistration />} />
        <Route path="/ResignationDemp" element={<ResignationDemp />} />
        <Route path="/ResignationUemp/:id" element={<ResignationUemp />} />
        <Route path="/ResignationVemp" element={<ResignationVemp />} />
        {/* <Route path="/SalaryDashboard" element={<SalaryDashboard />} /> */}
        <Route path="/addSalary" element={<AddSalary />} />
        <Route path="/fetchSalary" element={<FetchSalary />} />
        <Route path="/updateSalary/:id" element={<UpdateSalary />} />
        <Route path="/fetchInquiry" element={<FetchInquiry />} />
        <Route path="/fetchAnnouncement" element={<FetchAnnouncement />} />
        <Route path="/accessF" element={<AccessF />} />

        <Route path="/AccessUpdate/:id" element={<AccessUpdate />} />
        <Route path="/approved-leaves" element={<ApprovedLeaves />} />
      </Routes>
    </div>
  );
}
