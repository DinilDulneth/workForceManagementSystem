import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AuthStyles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8070/employee/login", { email, password });
      alert("Login Successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Role-based navigation
      if (res.data.role === "admin") {
        navigate("/ManagerDashboard");
      } else {
        navigate("/ManagerDashboard");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center">
      <div className="auth-glass-card p-5">
        <h2 className="text-center fw-bold mb-4">Welcome</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control glass-input mb-4" placeholder="Email Address" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control glass-input mb-4" placeholder="Password" required />
          <button type="submit" className="btn glass-btn w-100">Login</button>
        </form>
        <div className="text-center mt-4">
          <p>Don't have an account?</p>
          <button className="btn glass-btn-outline w-100" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
