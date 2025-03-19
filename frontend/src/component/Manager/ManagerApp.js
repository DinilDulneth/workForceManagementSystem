import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MDashboard from "./component/MDashboard";
import FetchEmp from "./component/fetchEmp";
import DashboardOverView from "./component/dashboardOverview";
import ProgressAnalytics from "./component/ProgressAnalytics";
import ManageTask from "./component/ManageTask";
import EmployeeProgress from "./component/EmployeeProgress";

function ManagerApp() {
  return (
    <>
      <MDashboard />
      <Routes>
        <Route path="/" element={<DashboardOverView />} />
        <Route path="/empAll" element={<FetchEmp />} />
        <Route path="/analytics" element={<ProgressAnalytics />} />
        <Route path="/manageTask" element={<ManageTask />} />
        <Route path="/progress/:id" element={<EmployeeProgress />} />
      </Routes>
    </>
  );
}

export default ManagerApp;
