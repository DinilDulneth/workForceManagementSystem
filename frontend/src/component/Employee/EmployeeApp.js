import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResignationF from "./component/ResignationF";
import ResignationU from "./component/ResignationU";
import ResignationV from "./component/ResignationV";
import ResignationD from "./component/ResignationD";
import EmployeeDashboard from "./component/EmployeeDashboard";
import LeaveRequest from "./component/LeaveRequest";
import FetchAnnouncement from "./component/fetchAnnouncement";
import AddInquiry from "./component/addInquiry";
import FetchFeedback from "./component/fetchFeedback";
import Fetchinquiry from "./component/fetchinquiry";
import Ine from "react-bootstrap";

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
        <Route path="/addInquiry" element={<AddInquiry />} />
        <Route path="/fetchAnnouncement" element={<FetchAnnouncement />} />
        <Route path="/LeaveRequest" element={<LeaveRequest />} />
        <Route path="/FetchFeedback" element={<FetchFeedback />} />
        <Route path="/Fetchinquiry" element={<Fetchinquiry />} />
      </Routes>
    </>
  );
}
