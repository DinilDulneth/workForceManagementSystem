import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLogin from "./component/UserLogin";
import HRApp from "./component/HR/HRApp";
import Index from "./component/Home";
import EmployeeApp from "./component/Employee/EmployeeApp";
import About from "./component/About";
import ContactUs from "./component/ContactUs";
import ManagerApp from "./component/Manager/ManagerApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/HRDashboard/*" element={<HRApp />} />
        <Route path="/ManagerDashboard/*" element={<ManagerApp />} />
        <Route path="/EmployeeDashboard/*" element={<EmployeeApp />} />
        <Route path="/About" element={<About />} />
        <Route path="/ContactUs" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
