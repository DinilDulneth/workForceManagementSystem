import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResignationF from "./component/ResignationF";
import ResignationU from "./component/ResignationU";
import ResignationV from "./component/ResignationV";
import ResignationD from "./component/ResignationD";
import EmployeeDashboard from "./component/EmployeeDashboard";

export default function EmployeeApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/ResignationF" element={<ResignationF />} />
        <Route path="/ResignationU/:id" element={<ResignationU />} />
        <Route path="/ResignationV" element={<ResignationV />} />
        <Route path="/ResignationD" element={<ResignationD />} />
        {/* <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} /> */}
      </Routes>
    </>
  );
}
