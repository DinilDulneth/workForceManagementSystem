import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AuthStyles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const { confirmPassword, ...submitData } = formData; // exclude confirmPassword before sending to backend
      await axios.post("http://localhost:8070/employee/register", submitData);
      alert("Registered Successfully");
      navigate("/UserLogin");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center">
      <div className="auth-glass-card p-5">
        <h2 className="text-center fw-bold mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="form-control glass-input mb-3"
            placeholder="Full Name"
            required
          />
          <input
            type="number"
            name="age"
            onChange={handleChange}
            className="form-control glass-input mb-3"
            placeholder="Age"
            required
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="form-control glass-input mb-3"
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="form-control glass-input mb-3"
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            className="form-control glass-input mb-3"
            placeholder="Confirm Password"
            required
          />
          <select
            name="role"
            onChange={handleChange}
            className="form-select glass-input mb-4"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit" className="btn glass-btn w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p>Already have an account?</p>
          <button
            className="btn glass-btn-outline w-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
