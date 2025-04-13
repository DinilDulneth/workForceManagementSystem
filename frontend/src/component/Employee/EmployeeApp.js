import React from "react";
import { Routes, Route } from "react-router-dom";
import ResignationF from "./component/ResignationF";
import ResignationU from "./component/ResignationU";
import ResignationV from "./component/ResignationV";
import ResignationD from "./component/ResignationD";
import EmployeeDashboard from "./component/EmployeeDashboard";
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
    link: "/EmployeeDashboard/ResignationF",
    name: "Resignation Form",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeDashboard/ResignationV",
    name: "Resignation View",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeDashboard/ResignationD",
    name: "Resignation Delete",
    icon: "FaUserCircle"
  },
  // {
  //   link: "/EmployeeDashboard/addInquiry",
  //   name: "Add Inquiry",
  //   icon: "FaUserCircle"
  // },
  {
    link: "/EmployeeDashboard/LeaveRequest",
    name: "Leave Request",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeDashboard/FetchFeedback",
    name: "Fetch Feedback",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeDashboard/Fetchinquiry",
    name: "Fetch Inquiry",
    icon: "FaUserCircle"
  },
  {
    link: "/EmployeeDashboard/addInquiry",
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
        <Route path="/" element={<EmployeeDashboard />} />
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
