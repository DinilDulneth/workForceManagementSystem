import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/images/logo1.png";

export default function ManageTask() {
  // Retrieve user data from localStorage
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name");
  const role = localStorage.getItem("role");
  const MID = localStorage.getItem("ID");

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [tName, setName] = useState("");
  const [description, setdescription] = useState("");
  const [deadLine, setdeadLine] = useState("");
  const [priority, setpriority] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [empID, setSelectedEmployeeId] = useState("");

  const getTaskStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "To Do";
      case 2:
        return "In Progress"; // Task is actively being worked on
      case 3:
        return "Completed"; // Task is finished
      case 4:
        return "Pending"; // Task is waiting for action or approval
      case 5:
        return "On Hold"; // Task is paused or delayed
      case 6:
        return "Cancelled"; // Task is no longer active
      case 7:
        return "Not Started"; // Task has not begun
      case 8:
        return "Overdue"; // Task missed its deadline
      case 9:
        return "Review Required"; // Task needs review or approval
      case 10:
        return "Blocked"; // Task is blocked by another issue
      case 11:
        return "Deferred"; // Task is postponed to a later date
      default:
        return "Unknown"; // Default case for unexpected values
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 2: // Completed
        return "green";
      case 7: // Overdue
        return "red";
      case 1: // In Progress
      case 3: // Pending
      case 6: // Not Started
        return "orange";
      case 4: // On Hold
      case 9: // Blocked
      case 10: // Deferred
        return "gray";
      case 5: // Cancelled
        return "darkgray";
      default:
        return "black";
    }
  };
  // Status mapping
  const statusTypes = {
    1: "To Do",
    2: "In Progress",
    3: "Completed",
    4: "Pending",
    5: "On Hold",
    6: "Cancelled",
    7: "Not Started",
    8: "Overdue",
    9: "Review Required",
    10: "Blocked",
    11: "Deferred"
  };

  useEffect(() => {
    getEmployee();
    getTask(); // Ensure tasks are fetched when the component mounts
  }, []);

  function getEmployee() {
    axios
      .get("http://localhost:8070/employee/getEmp")
      .then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      });
  }

  const getTask = async () => {
    axios
      .get("http://localhost:8070/task/")
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Task:", err);
      });
  };

  function setTask(e) {
    e.preventDefault();
    const newTask = {
      tName,
      description,
      empID,
      assignedBy: MID,
      deadLine,
      priority
    };
    axios
      .post("http://localhost:8070/task/add", newTask)
      .then((res) => {
        // Find employee email from employees array
        const employee = employees.find((emp) => emp._id === empID);
        if (employee && employee.email) {
          // Send email notification
          sendTaskNotification(newTask, employee.email)
            .then(() => {
              console.log("Task notification email sent");
            })
            .catch((error) => {
              console.error("Failed to send task notification:", error);
            });
        }
        Swal.fire("Success!", "Task Added Successfully! ✅", "success");
        setName("");
        setdescription("");
        setSelectedEmployeeId("");
        setdeadLine("");
        setpriority("");
        getTask(); // Fetch tasks again to update the list
      })
      .catch((err) => {
        Swal.fire("Error!", "Error adding Task: " + err.message, "error");
      });
    console.log(newTask);
  }
  const sendTaskNotification = async (taskDetails, employeeEmail) => {
    try {
      const response = await fetch(
        "http://localhost:8070/api/gmail/send-task-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ taskDetails, employeeEmail })
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error sending task notification:", error);
    }
  };

  function handleEditClick(task) {
    setEditingTaskId(task._id);
    setEditedTask({ ...task });
  }

  function editTask(e, tid, eid) {
    e.preventDefault();
    const updateTask = {
      description: editedTask.description,
      deadLine: editedTask.deadLine,
      priority: editedTask.priority
    };
    axios
      .put(`http://localhost:8070/task/update/${tid}`, updateTask)
      .then(() => {
        Swal.fire("Updated!", "Task has been updated successfully.", "success");
        setEditingTaskId(null);
        getTask(eid); // Ensure this fetches the latest data
      })
      .catch((err) => {
        Swal.fire(
          "Error!",
          "Failed to update the task: " + err.message,
          "error"
        );
      });
  }

  function deleteTask(tid, eid) {
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to delete this task? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8070/task/deleteFromDatabase/${tid}`)
          .then(() => {
            Swal.fire(
              "Deleted!",
              "Task has been deleted successfully.",
              "success"
            );
            getTask(eid); // Refresh the task list
          })
          .catch((err) => {
            Swal.fire(
              "Error!",
              "Failed to delete the task: " + err.message,
              "error"
            );
          });
      }
    });
  }

  // Filter tasks based on search term and selected status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.tName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(task.startDate).toLocaleDateString().includes(searchTerm);
    const matchesStatus = selectedStatus
      ? task.status === parseInt(selectedStatus)
      : true;
    return matchesSearch && matchesStatus;
  });

  const downloadTasksAsPDF = () => {
    toast.info("Preparing your PDF...", {
      position: "top-right",
      autoClose: 2000
    });

    const doc = new jsPDF();

    const img = new Image();
    img.src = logo;
    img.onload = function () {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = 50;
      const imgHeight = 30;
      const padding = 10;

      doc.addImage(img, "PNG", padding, padding, imgWidth, imgHeight);

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Recent Tasks List", pageWidth / 2, padding + imgHeight / 2, {
        align: "center"
      });

      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${currentDate}`, pageWidth - padding, padding + 10, {
        align: "right"
      });

      doc.setDrawColor(0); // Black color
      doc.setLineWidth(0.5);
      doc.line(
        padding,
        padding + imgHeight + 5,
        pageWidth - padding,
        padding + imgHeight + 5
      );

      // Table
      const tableColumn = [
        "Task No.",
        "Task Name",
        "Description",
        "Status",
        "Employee ID",
        "Deadline",
        "Start Date",
        "End Date",
        "Priority"
      ];
      const tableRows = [];

      filteredTasks.forEach((task, index) => {
        const taskData = [
          index + 1,
          task.tName,
          task.description,
          getTaskStatusLabel(task.status),
          task.empID,
          new Date(task.deadLine).toLocaleDateString(),
          new Date(task.startDate).toLocaleDateString(),
          task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A",
          task.priority
        ];
        tableRows.push(taskData);
      });

      const startY = padding + imgHeight + 15;
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        styles: { fontSize: 10 },
        theme: "grid"
      });

      // Footer
      const footerText = "Confidential - Company Name";
      const addFooter = (pageNum, totalPages) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Page ${pageNum} of ${totalPages} | ${footerText}`,
          pageWidth / 2,
          pageHeight - padding,
          { align: "center" }
        );
      };

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i, totalPages);
      }
      doc.save("Recent_Tasks_List.pdf");

      toast.success("PDF downloaded successfully!", {
        position: "top-right",
        autoClose: 2000
      });
    };
  };
  return (
    <div
      style={{ marginLeft: "290px", marginTop: "100px", marginRight: "40px" }}
    >
      <h2 className="mb-4">Tasks Manage</h2>
      {/* Status Filter */}
      <div className="mb-3 d-flex flex-column gap-2">
        {Object.entries(statusTypes).map(([key, value]) => (
          <div key={key} className="form-check">
            <input
              type="radio"
              name="statusFilter"
              id={`status-${key}`}
              value={key}
              checked={selectedStatus === key}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-check-input"
            />
            <label htmlFor={`status-${key}`} className="form-check-label">
              {value}
            </label>
          </div>
        ))}

        {/* Clear Filter Button */}
        <button
          className="btn btn-sm btn-danger mt-2"
          onClick={() => setSelectedStatus("")}
          style={{ width: "150px" }}
        >
          Clear Filter
        </button>
      </div>
      <div className="mb-4 position-relative custom-search-wrapper">
        {/* Filter box */}
        <div className="custom-search-box">
          <input
            type="text"
            className="custom-search-input"
            placeholder="Search Task by name, Priority, or Start Date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className="table-responsive">
          <div
            className="table-responsive bg-white shadow-lg p-3 pt-0 "
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-bordered table-hover table-striped ">
              <thead
                className="table-dark"
                style={{ position: "sticky", top: "0", zIndex: "1000" }}
              >
                <tr>
                  <th>#</th> {/* Task No. Column */}
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Attachment</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td> {/* Task Number */}
                    <td>{task.tName}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.deadLine).toLocaleDateString()}</td>
                    <td>
                      {task.attachmentPath ? (
                        <a
                          href={task.attachmentPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          View Attachment
                        </a>
                      ) : (
                        "Attachment not available"
                      )}
                    </td>
                    <td>{task.priority}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(task.status),
                          color: "white"
                        }}
                      >
                        {getTaskStatusLabel(task.status)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditClick(task)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteTask(task._id, task.empID)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-primary btn-sm mb-3 mt-4"
            onClick={downloadTasksAsPDF}
            style={{ width: "120px" }}
          >
            Download PDF
          </button>
        </div>

        {editingTaskId && (
          <div className="bg-white shadow-lg p-4 mt-5">
            <h3 className="mb-4 text-left">Edit Task</h3>
            <form
              onSubmit={(e) => editTask(e, editingTaskId, editedTask.empID)}
            >
              <div className="row g-3">
                {/* Description */}
                <div className="col-12">
                  <label htmlFor="editDescription" className="form-label">
                    <i className="bi bi-card-text me-2"></i>Description
                  </label>
                  <input
                    type="text"
                    id="editDescription"
                    className="form-control"
                    placeholder="Update task description"
                    value={editedTask.description}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        description: e.target.value
                      })
                    }
                    required
                  />
                </div>

                {/* Deadline */}
                <div className="col-md-6">
                  <label htmlFor="editDeadline" className="form-label">
                    <i className="bi bi-calendar-event me-2"></i>Deadline
                  </label>
                  <input
                    type="date"
                    id="editDeadline"
                    className="form-control"
                    value={editedTask.deadLine}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, deadLine: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Priority */}
                <div className="col-md-6">
                  <label htmlFor="editPriority" className="form-label">
                    <i className="bi bi-exclamation-circle me-2"></i>Priority
                  </label>
                  <select
                    id="editPriority"
                    className="form-select"
                    value={editedTask.priority}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, priority: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Priority...</option>
                    <option value="1">1 - Very Low</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Below Average</option>
                    <option value="4">4 - Slightly Low</option>
                    <option value="5">5 - Medium</option>
                    <option value="6">6 - Slightly High</option>
                    <option value="7">7 - Above Average</option>
                    <option value="8">8 - High</option>
                    <option value="9">9 - Very High</option>
                    <option value="10">10 - Critical</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-success me-2 px-4">
                    <i className="bi bi-check-lg me-2"></i>Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary me-2 px-4"
                    onClick={() =>
                      setEditedTask({
                        description: "",
                        deadLine: "",
                        priority: ""
                      })
                    }
                  >
                    <i className="bi bi-x-lg me-2"></i>Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning px-4"
                    onClick={() => setEditingTaskId(null)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-lg p-4 mb-5 mt-5">
          <h3 className="mb-4 text-left">Add New Task</h3>
          <form onSubmit={setTask}>
            <div className="row g-3">
              {/* Task Name */}
              <div className="col-md-6">
                <label htmlFor="taskName" className="form-label">
                  <i className="bi bi-pencil-square me-2"></i>Task Name
                </label>
                <input
                  type="text"
                  id="taskName"
                  className="form-control"
                  placeholder="Enter task name"
                  value={tName}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="col-md-6">
                <label htmlFor="taskDescription" className="form-label">
                  <i className="bi bi-card-text me-2"></i>Description
                </label>
                <input
                  type="text"
                  id="taskDescription"
                  className="form-control"
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  required
                />
              </div>

              {/* Deadline */}
              <div className="col-md-6">
                <label htmlFor="taskDeadline" className="form-label">
                  <i className="bi bi-calendar-event me-2"></i>Deadline
                </label>
                <input
                  type="date"
                  id="taskDeadline"
                  className="form-control"
                  value={deadLine}
                  onChange={(e) => setdeadLine(e.target.value)}
                  required
                />
              </div>

              {/* Priority */}
              <div className="col-md-6">
                <label htmlFor="taskPriority" className="form-label">
                  <i className="bi bi-exclamation-circle me-2"></i>Priority
                </label>
                <select
                  id="taskPriority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setpriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority...</option>
                  <option value="1">1 - Very Low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Below Average</option>
                  <option value="4">4 - Slightly Low</option>
                  <option value="5">5 - Medium</option>
                  <option value="6">6 - Slightly High</option>
                  <option value="7">7 - Above Average</option>
                  <option value="8">8 - High</option>
                  <option value="9">9 - Very High</option>
                  <option value="10">10 - Critical</option>
                </select>
              </div>

              {/* Assign to Employee */}
              <div className="col-12">
                <label htmlFor="employeeSelect" className="form-label">
                  <i className="bi bi-person-check me-2"></i>Assign to Employee
                </label>
                <select
                  id="employeeSelect"
                  className="form-select"
                  value={empID}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-plus-lg me-2"></i> Add Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
