import { Routes, Route } from "react-router-dom";
import FetchEmp from "./component/fetchEmp";
import ResignationVemp from "./component/ResignationVemp";
import UserRegister from "./component/UserRegister";
import DashboardHR from "./component/DashboardHR";
export default function HRApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardHR />} />
        <Route path="/FetchEmp" element={<FetchEmp />} />
        <Route path="/ResignationVemp" element={<ResignationVemp />} />
        <Route path="/UserRegister" element={<UserRegister />} />
      </Routes>
    </>
  );
}
