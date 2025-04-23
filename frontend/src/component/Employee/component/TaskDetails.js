import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TaskDetails() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ status: "" });

  useEffect(() => {
    const id = localStorage.getItem("ID");
    if (id) {
      getTask(id);
    }
  }, []);

  const getTask = (id) => {
    axios
      .get(`http://localhost:8070/task/getByEmpID/${id}`)
      .then((res) => {
        const sortedTasks = res.data.task.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setTasks(sortedTasks);
      })
      .catch((err) => console.error("Error fetching Task:", err));
  };

  const getTaskStatusLabel = (status) => {
    const statusMap = {
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
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status) => {
    const statusColors = {
      1: "#FFA500", // To Do (Orange)
      2: "#007BFF", // In Progress (Blue)
      3: "#28A745", // Completed (Green)
      4: "#FFC107", // Pending (Yellow)
      5: "#FD7E14", // On Hold (Dark Orange)
      6: "#DC3545", // Cancelled (Red)
      7: "#6F42C1", // Not Started (Purple)
      8: "#E63946", // Overdue (Dark Red)
      9: "#17A2B8", // Review Required (Cyan/Info)
      10: "#343A40", // Blocked (Dark Grey)
      11: "#20C997" // Deferred (Teal)
    };
    return statusColors[status] || "muted";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      High: "#DC3545", // Red
      Medium: "#FFC107", // Yellow
      Low: "#28A745" // Green
    };
    return priorityColors[priority] || "#6C757D"; // Default to grey if priority is unknown
  };

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

  const filteredTask = tasks.filter((task) => {
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
    doc.setFontSize(18);
    doc.text("Recent Tasks List", 10, 10);

    const tableColumn = [
      "Task No.",
      "Task Name",
      "Description",
      "Status",
      "Deadline",
      "Start Date",
      "End Date",
      "Priority"
    ];
    const tableRows = [];

    filteredTask.forEach((task, index) => {
      const taskData = [
        index + 1,
        task.tName,
        task.description,
        getTaskStatusLabel(task.status),
        new Date(task.deadLine).toLocaleDateString(),
        new Date(task.startDate).toLocaleDateString(),
        task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A",
        task.priority
      ];
      tableRows.push(taskData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("Recent_Tasks_List.pdf");

    toast.success("PDF downloaded successfully!", {
      position: "top-right",
      autoClose: 2000
    });
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({ status: task.status.toString() });
  };

  const handleStatusChange = (e) => {
    setEditedTask({ ...editedTask, status: e.target.value });
  };

  const handleSave = (taskId, empId) => {
    if (!editedTask.status) {
      Swal.fire("Error!", "Please select a status.", "error");
      return;
    }

    const updateTask = {
      status: parseInt(editedTask.status)
    };

    axios
      .put(`http://localhost:8070/task/update/${taskId}`, updateTask)
      .then(() => {
        Swal.fire("Updated!", "Task status updated successfully.", "success");
        setEditingTaskId(null);
        getTask(empId);
      })
      .catch((err) => {
        Swal.fire(
          "Error!",
          "Failed to update task status: " + err.message,
          "error"
        );
      });
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedTask({ status: "" });
  };

  return (
    <div className="container" style={{ marginLeft: "250px", width: "83%" }}>
      <h1>Task Details</h1>
      <div className="card p-3">
        <h5 className="mb-3">Recent Tasks</h5>

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
          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={() => setSelectedStatus("")}
            style={{ width: "150px" }}
          >
            Clear Filter
          </button>
        </div>

        <div className="mb-4 position-relative custom-search-wrapper">
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

        <div className="d-flex flex-wrap gap-3">
          {filteredTask.map((task) => (
            <div
              key={task._id}
              className="card"
              style={{
                width: "300px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                position: "relative" // Added for the priority bar
              }}
            >
              <h5>{task.tName}</h5>
              <p>{task.description}</p>
              <p>
                <strong>Status:</strong>{" "}
                {editingTaskId === task._id ? (
                  <select
                    value={editedTask.status}
                    onChange={handleStatusChange}
                    className="form-select"
                  >
                    <option value="">Select Status</option>
                    {Object.entries(statusTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusColor(task.status),
                      color: "white"
                    }}
                  >
                    {getTaskStatusLabel(task.status)}
                  </span>
                )}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(task.deadLine).toLocaleDateString()}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(task.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {task.endDate
                  ? new Date(task.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <div className="d-flex justify-content-between">
                {editingTaskId === task._id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleSave(task._id, task.empID)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit
                  </button>
                )}
              </div>
              {/* Priority color bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  height: "10px",
                  backgroundColor: getPriorityColor(task.priority)
                }}
              ></div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-sm mb-3 mt-4"
          onClick={downloadTasksAsPDF}
          style={{ width: "120px" }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
