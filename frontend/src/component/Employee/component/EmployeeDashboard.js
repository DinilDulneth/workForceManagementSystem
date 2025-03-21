import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const decodedToken = jwtDecode(token);
    // Adjust these based on your actual token payload structure
    const userId = decodedToken.sub || decodedToken.email;
    const userName = decodedToken.name || decodedToken.email;
    return { userId, userName };
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return null;
  }
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // Get values from localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name"); // If your backend provides this
  const role = localStorage.getItem("role");
  const ID = localStorage.getItem("ID");
  const userInfo = decodeToken(token);

  console.log(`User ID:${ID}`);
  console.log(`User Name:${name}`);
  console.log(`User Email:${email}`);

  // Check if user is authenticated and has correct role
  if (!userInfo || role !== "Employee") {
    // Redirect to login if token is invalid or role doesn't match
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h2>Welcome, {name || userInfo.userName || email}</h2>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
      <p>Employee Dashboard</p>
      <br />
      <a href="/EmployeeDashboard/ResignationF">Resignation Form</a>
      <br />
      <a href="/EmployeeDashboard/ResignationV">Resignation View</a>
      <br />
      <a href="/EmployeeDashboard/ResignationD">Resignation Delete</a>
      <br />
      <a href="/EmployeeDashboard/ResignationU/:id">Resignation Update</a>
      <br />
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
