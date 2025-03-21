import React from "react";

export default function EmployeeDashboard() {
  return (
    <div>
      employee dashboard
      <br />
      <a href="/EmployeeDashboard/ResignationF">Resignation Form</a>
      <br />
      <a href="/EmployeeDashboard/ResignationV">Resignation View</a>
      <br />
      <a href="/EmployeeDashboard/ResignationD">Resignation Delete</a>
      <br />
      <a href="/EmployeeDashboard/ResignationU/:id">Resignation Update</a>
      <br />
    </div>
  );
}
