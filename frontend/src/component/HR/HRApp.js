import { Routes, Route } from "react-router-dom";
import FetchEmp from "./fetchEmp";
import ResignationVemp from "./ResignationVemp.js";
import UserRegister from "./UserRegister";

export default function HRApp() {
  return (
    <>
      <Routes>
        <Route path="/FetchEmp" element={<FetchEmp />} />
        <Route path="/ResignationVemp" element={<ResignationVemp />} />
        <Route path="/UserRegister" element={<UserRegister />} />
      </Routes>
    </>
  );
}
