import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

export default function FetchTask() {
  //   const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTask();
  }, []);

  function getTask() {
    axios
      .get("http://localhost:8070/task/")
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        });
      });
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task List</h2>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Task Name</th>
            <th scope="col">Description</th>
            <th scope="col">Assigned Employee</th>
            <th scope="col">Assigned By</th>
            <th scope="col">Deadline</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <th scope="row">{index + 1}</th>
              <td>{task.tName}</td>
              <td>{task.description}</td>
              <td>{task.empID}</td>
              <td>{task.assignedBy}</td>
              <td>{task.deadLine}</td>
              <td>{task.startDate}</td>
              <td>{task.endDate}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
