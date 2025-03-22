import { Routes, Route } from "react-router-dom";
import FetchEmp from "./component/fetchEmp";
import ResignationVemp from "./component/ResignationVemp";
import UserRegister from "./component/UserRegister";
import DashboardHR from "./component/DashboardHR";
import SalaryDashboard from "./component/SalaryDashboard";
import FetchSalary from "./component/fetchSalary";
import AddSalary from "./component/addSalary";
import UpdateSalary from "./component/updateSalary";
import FetchHR from "./component/fetchHR";
import FetchManager from "./component/fetchManager";
import HRResignation from "./component/HRRegistration";
import ManagerRegistration from "./component/ManagerRegistration";
import RegistrationDemo from "./component/ResignationDemp";
import RegistrationUemo from "./component/ResignationUemp";
import RegistrationVemo from "./component/ResignationVemp";
export default function HRApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardHR />} />
        <Route path="/FetchEmp" element={<FetchEmp />} />
        <Route path="/fetchHR" element={<FetchHR />} />
        <Route path="/fetchManager" element={<FetchManager />} />
        <Route path="/ResignationVemp" element={<ResignationVemp />} />
        <Route path="/UserRegister" element={<UserRegister />} />
        <Route path="/HRResignation" element={<HRResignation />} />
        <Route path="/ManagerRegistration" element={<ManagerRegistration />} />
        <Route path="/RegistrationDemo" element={<RegistrationDemo />} />
        <Route path="/RegistrationUemo" element={<RegistrationUemo />} />
        <Route path="/RegistrationVemo" element={<RegistrationVemo />} />
        <Route path="/SalaryDashboard" element={<SalaryDashboard />} />
        {/* <Route path="/HRDashboard" element={<HRDashboard />} /> */}
        <Route path="/addSalary" element={<AddSalary />} />
        <Route path="/fetchSalary" element={<FetchSalary />} />
        <Route path="/updateSalary/:id" element={<UpdateSalary />} />
      </Routes>
    </>
  );
}

// need to fix
