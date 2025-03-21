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
      // Store necessary information in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);

      if (data.name) {
        localStorage.setItem("name", data.name);
      }

      switch (data.role) {
        case "HR":
          await getHrID(email);
          navigate("/HRDashboard");
          break;

        case "Manager":
          await getManagerID(email);
          navigate("/ManagerDashboard");
          break;

        case "Employee":
          await getEmployeeID(email);
          navigate("/EmployeeDashboard");
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  function getHrID(email) {
    axios
      .get(`http://localhost:8070/hr/getHRByEmail/${email}`)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("ID", res.data._id);
        localStorage.setItem("Name", res.data.name);
      })
      .catch((err) => {
        console.error("Error fetching HR:", err);
      });
  }

  function getManagerID(email) {
    axios
      .get(`http://localhost:8070/manager/getManagerByEmail/${email}`)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("ID", res.data._id);
        localStorage.setItem("Name", res.data.name);
      })
      .catch((err) => {
        console.error("Error fetching manager:", err);
      });
  }

  function getEmployeeID(email) {
    axios
      .get(`http://localhost:8070/employee/getEmployeeByEmail/${email}`)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("ID", res.data._id);
        localStorage.setItem("Name", res.data.name);
      })
      .catch((err) => {
        console.error("Error fetching Employee:", err);
      });
  }

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
