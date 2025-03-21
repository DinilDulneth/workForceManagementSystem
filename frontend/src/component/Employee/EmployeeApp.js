import { Routes, Route } from "react-router-dom";
import ResignationF from "./ResignationF";
import ResignationU from "./ResignationU";
import ResignationV from "./ResignationV";
import ResignationD from "./ResignationD";

export default function EmployeeApp() {
  return (
    <>
      <Routes>
        <Route path="/ResignationF" element={<ResignationF />} />
        <Route path="/ResignationU/:id" element={<ResignationU />} />
        <Route path="/ResignationV" element={<ResignationV />} />
        <Route path="/ResignationD" element={<ResignationD />} />
      </Routes>
    </>
  );
}
