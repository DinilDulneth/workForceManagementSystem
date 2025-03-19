import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8070/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      switch (data.role) {
        case "HR":
          navigate("/HRDashboard");
          break;
        case "Manager":
          navigate("/ManagerDashboard");
          break;
        case "Employee":
          navigate("/EmployeeDashboard");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default UserLogin;
