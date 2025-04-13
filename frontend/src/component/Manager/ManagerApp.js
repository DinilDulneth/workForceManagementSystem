import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MDashboard from "./component/MDashboard";
import FetchEmp from "./component/fetchEmp";
import DashboardOverView from "./component/dashboardOverview";
import ProgressAnalytics from "./component/ProgressAnalytics";
import ManageTask from "./component/ManageTask";
import EmployeeProgress from "./component/EmployeeProgress";
import LeaveApproval from "./component/LeaveApproval";
import DashboardTemp from "../../component/DashboardTemp";

const links = [
  { link: "/ManagerDashboard", name: "Dashboard", icon: "bi-house-door" },
  {
    link: "/ManagerDashboard/analytics",
    name: "Progress Analytics",
    icon: "bi-bar-chart"
  },
  {
    link: "/ManagerDashboard/empAll",
    name: "Handling Employees",
    icon: "bi-people"
  },
  {
    link: "/ManagerDashboard/manageTask",
    name: "Manage Task",
    icon: "bi-card-checklist"
  },
  {
    link: "/ManagerDashboard/leavesAp",
    name: "Leave Approval",
    icon: "bi-check-circle"
  },
  { link: "/ManagerDashboard/settings", name: "Settings", icon: "bi-gear" }
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
      </Routes>
    </>
  );
}

export default ManagerApp;
