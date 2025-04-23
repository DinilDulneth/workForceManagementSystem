import React from "react";
import { Routes, Route } from "react-router-dom";
import ResignationF from "./component/ResignationF";
import ResignationU from "./component/ResignationU";
import ResignationV from "./component/ResignationV";
import ResignationD from "./component/ResignationD";
import EmployeeDashboard from "./component/EmployeeHome";
import LeaveRequest from "./component/LeaveRequest";
import FetchAnnouncement from "./component/fetchAnnouncement";
import AddInquiry from "./component/addInquiry";
import FetchFeedback from "./component/fetchFeedback";
import Fetchinquiry from "./component/fetchinquiry";
import Ine from "react-bootstrap";
import DashboardTemp from "../DashboardTemp";
import UpdateInquiry from "./component/UpdateInquiry";
import TaskDetails from "./component/TaskDetails";

const Links = [
  {
    link: "/EmployeeHome",
    name: "Dashboard Overview",
    icon: "bi-house-door"
  },
  {
    link: "/EmployeeHome/TaskDetails",
    name: "Task Details",
    icon: "bi-tasks"
  },
  {
    link: "/EmployeeHome/ResignationF",
    name: "Resignation Form",
    icon: "bi bi-file-text"
  },
  {
    link: "/EmployeeHome/ResignationV",
    name: "Resignation View",
    icon: "bi bi-eye"
  },
  {
    link: "/EmployeeHome/ResignationD",
    name: "Resignation Delete",
    icon: "bi bi-trash"
  },
  {
    link: "/EmployeeHome/LeaveRequest",
    name: "Leave Request",
    icon: "bi bi-calendar-check"
  },
  {
    link: "/EmployeeHome/FetchFeedback",
    name: "Feedback",
    icon: "bi bi-chat-dots"
  },
  {
    link: "/EmployeeHome/fetchAnnouncement",
    name: "Announcements",
    icon: "bi bi-megaphone"
  },
  {
    link: "/EmployeeHome/addInquiry",
    name: "Add Inquiry",
    icon: "bi bi-question-circle"
  }
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
        <Route path="/updateInquiry/:id" element={<UpdateInquiry />} />
        <Route path="/TaskDetails" element={<TaskDetails />} />
      </Routes>
    </>
  );
}
