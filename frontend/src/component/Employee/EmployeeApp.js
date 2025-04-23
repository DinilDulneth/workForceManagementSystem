import React from "react";
import { Routes, Route } from "react-router-dom";
import ResignationF from "./component/ResignationF";
import ResignationU from "./component/ResignationU";
import ResignationV from "./component/ResignationV";
import ResignationD from "./component/ResignationD";
import EmployeeHome from "./component/EmployeeHome";
import LeaveRequest from "./component/LeaveRequest";
import FetchAnnouncement from "./component/fetchAnnouncement";
import AddInquiry from "./component/addInquiry";
import FetchFeedback from "./component/fetchFeedback";
import Fetchinquiry from "./component/fetchinquiry";
import Ine from "react-bootstrap";
import DashboardTemp from "../DashboardTemp";

const Links = [
  // { link: "#", name: "Dashboard", icon: "FaHome" },
  {
    link: "/EmployeeHome",
    name: "Dashboard",
    icon: "bi-house-door"
  },
  {
    link: "/EmployeeHome/ResignationF",
    name: "Resignation Form",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeHome/ResignationV",
    name: "Resignation View",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeHome/ResignationD",
    name: "Resignation Delete",
    icon: "FaUserCircle"
  },
  // {
  //   link: "/EmployeeDashboard/addInquiry",
  //   name: "Add Inquiry",
  //   icon: "FaUserCircle"
  // },
  {
    link: "/EmployeeHome/LeaveRequest",
    name: "Leave Request",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeHome/FetchFeedback",
    name: "Fetch Feedback",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeHome/Fetchinquiry",
    name: "Fetch Inquiry",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeHome/addInquiry",
    name: "Add Inquiry",
    icon: "FaUserCircle"
  },
  { link: "#", name: "Settings", icon: "FaCog" }
];

export default function EmployeeApp() {
  return (
    <>
      <DashboardTemp ArrLinkList={Links} />
      <Routes>
        <Route path="/" element={<EmployeeHome />} />
        <Route path="/ResignationF" element={<ResignationF />} />
        <Route path="/ResignationU/:id" element={<ResignationU />} />
        <Route path="/ResignationV" element={<ResignationV />} />
        <Route path="/ResignationD" element={<ResignationD />} />
        {/* <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} /> */}
        <Route path="/addInquiry" element={<AddInquiry />} />
        <Route path="/fetchAnnouncement" element={<FetchAnnouncement />} />
        <Route path="/LeaveRequest" element={<LeaveRequest />} />
        <Route path="/FetchFeedback" element={<FetchFeedback />} />
        <Route path="/Fetchinquiry" element={<Fetchinquiry />} />
      </Routes>
    </>
  );
}
