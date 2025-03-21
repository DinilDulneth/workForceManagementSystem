import { Routes, Route } from "react-router-dom";
import FetchEmp from "./fetchEmp";

export default function HRApp() {
  return (
    <>
      <Routes>
        <Route path="/FetchEmp" element={<FetchEmp />} />
      </Routes>
    </>
  );
}
