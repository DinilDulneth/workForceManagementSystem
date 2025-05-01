import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLogin from "./component/UserLogin";
import HRApp from "./component/HR/HRApp";
import Index from "./component/Home";
import EmployeeApp from "./component/Employee/EmployeeApp";
import About from "./component/About";
import ContactUs from "./component/ContactUs";
import ManagerApp from "./component/Manager/ManagerApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApprovedLeaves from "./component/HR/component/ApprovedLeaves";
import RegisterPage from "./component/RegisterPage";
import EmployeeRegisterForm from "./component/EmployeeRegisterForm";
import HRRegisterForm from "./component/HRRegisterForm";
import ManagerRegisterForm from "./component/ManagerRegisterForm";
import Test from "./component/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/HRDashboard/*" element={<HRApp />} />
        <Route path="/ManagerDashboard/*" element={<ManagerApp />} />
        <Route path="/EmployeeHome/*" element={<EmployeeApp />} />
        <Route path="/About" element={<About />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/hr/approved-leaves" element={<ApprovedLeaves />} />

        {/* registration */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/employee-register" element={<EmployeeRegisterForm />} />
        <Route path="/hr-register" element={<HRRegisterForm />} />
        <Route path="/manager-register" element={<ManagerRegisterForm />} />

        {/* test */}
        <Route path="/test" element={<Test />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
