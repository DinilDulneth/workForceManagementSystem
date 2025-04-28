import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardOverView from "./component/dashboardOverview";
import FetchEmp from "./component/fetchEmp";
import ProgressAnalytics from "./component/ProgressAnalytics";
import ManageTask from "./component/ManageTask";
import EmployeeProgress from "./component/EmployeeProgress";
import LeaveApproval from "./component/LeaveApproval";
import DashboardTemp from "../../component/DashboardTemp";
import MyCalendar from "../Calender";
import AddAnnouncement from "./component/addAnnouncement";
import FetchInquiry from "./component/fetchinquiry";
import AddFeedback from "./component/addFeedback";
import UpdateFeedback from "./component/UpdateFeedback";
import UpdateAnnouncement from "./component/UpdateAnnouncement";
import Settings from "./component/Settings";

const links = [
  { link: "/ManagerDashboard", name: "Dashboard", icon: "bi-house-door" },
  {
    link: "/ManagerDashboard/analytics",
    name: "Progress Analytics",
    icon: "bi-bar-chart",
  },
  {
    link: "/ManagerDashboard/empAll",
    name: "Handling Employees",
    icon: "bi-people",
  },
  {
    link: "/ManagerDashboard/manageTask",
    name: "Manage Task",
    icon: "bi-card-checklist",
  },
  {
    link: "/ManagerDashboard/addAnnouncement",
    name: "Post Announcements",
    icon: "bi-megaphone",
  },
  {
    link: "/ManagerDashboard/fetchinquiry",
    name: "View Inquiries",
    icon: "bi-question-circle",
  },
  {
    link: "/ManagerDashboard/addFeedback",
    name: "Submit Feedback",
    icon: "bi-chat-dots",
  },
  {
    link: "/ManagerDashboard/leavesAp",
    name: "Leave Approval",
    icon: "bi-check-circle",
  },
  { link: "/ManagerDashboard/settings", name: "Settings", icon: "bi-gear" },
];

function ManagerApp() {
  return (
    <>
      <DashboardTemp ArrLinkList={links} />
      <Routes>
        <Route path="/" element={<DashboardOverView />} />
        <Route path="/empAll" element={<FetchEmp />} />
        <Route path="/analytics" element={<ProgressAnalytics />} />
        <Route path="/manageTask" element={<ManageTask />} />
        <Route path="/progress/:id" element={<EmployeeProgress />} />
        <Route path="/leavesAp" element={<LeaveApproval />} />
        <Route path="/MyCalendar" element={<MyCalendar />} />
        <Route path="/addAnnouncement" element={<AddAnnouncement />} />
        <Route path="/fetchinquiry" element={<FetchInquiry />} />
        <Route path="/addFeedback" element={<AddFeedback />} />
        <Route path="/updateFeedback/:id" element={<UpdateFeedback />} />
        <Route
          path="/updateAnnouncement/:id"
          element={<UpdateAnnouncement />}
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default ManagerApp;
