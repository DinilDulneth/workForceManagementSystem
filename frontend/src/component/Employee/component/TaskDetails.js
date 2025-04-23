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
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortOptions = [
    { value: "startDate", label: "Start Date" },
    { value: "deadLine", label: "Deadline" },
    { value: "priority", label: "Priority" }
  ];
  useEffect(() => {
    const id = localStorage.getItem("ID");
    if (id) {
      getTask(id);
    }
  }, []);
  const getSortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "startDate":
        case "deadLine":
          const dateA = new Date(a[sortBy]);
          const dateB = new Date(b[sortBy]);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;

        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return sortOrder === "asc"
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority];

        case "status":
          return sortOrder === "asc"
            ? a.status - b.status
            : b.status - a.status;

        default:
          return 0;
      }
    });
  };
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

  // Replace the existing filteredTask variable with this
  const filteredTask = getSortedTasks(
    tasks.filter((task) => {
      const matchesSearch =
        task.tName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(task.startDate).toLocaleDateString().includes(searchTerm);
      const matchesStatus = selectedStatus
        ? task.status === parseInt(selectedStatus)
        : true;
      return matchesSearch && matchesStatus;
    })
  );

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
      status: parseInt(editedTask.status),
      empID: empId // Include empID in the update
    };

    axios
      .put(`http://localhost:8070/task/update/${taskId}`, updateTask)
      .then((response) => {
        if (response.data) {
          Swal.fire("Updated!", "Task status updated successfully.", "success");
          setEditingTaskId(null);
          // Update the local tasks state to reflect the change
          setTasks(
            tasks.map((task) =>
              task._id === taskId
                ? { ...task, status: parseInt(editedTask.status) }
                : task
            )
          );
        }
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
  // First, add these styles at the top of your file
  const modernStyles = {
    container: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      padding: "2rem",
      marginLeft: "250px",
      marginTop: "60px"
    },
    header: {
      marginBottom: "2rem",
      color: "#2c3e50",
      fontSize: "2.5rem",
      fontWeight: "600"
    },
    searchContainer: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "15px",
      boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.29)",
      marginBottom: "2rem"
    },
    taskCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.24)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 12px rgba(0, 0, 0, 0.26)"
      }
    },
    filterButton: {
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      border: "1px solid #e9ecef",
      backgroundColor: "white",
      color: "#495057",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#e9ecef"
      }
    },
    modernInput: {
      border: "1px solid #e9ecef",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      width: "100%",
      transition: "all 0.2s ease",
      "&:focus": {
        borderColor: "#007bff",
        boxShadow: "0 0 0 3px rgba(0,123,255,0.1)"
      }
    }
  };

  // Update the return statement with modern styling
  return (
    <div style={modernStyles.container}>
      <h1 style={modernStyles.header}>Task Dashboard</h1>

      <div style={modernStyles.searchContainer}>
        <div className="d-flex gap-4 align-items-center mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={modernStyles.modernInput}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ ...modernStyles.modernInput, width: "auto" }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="btn"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={modernStyles.filterButton}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {Object.entries(statusTypes).map(([key, value]) => (
            <button
              key={key}
              onClick={() =>
                setSelectedStatus(selectedStatus === key ? "" : key)
              }
              style={{
                ...modernStyles.filterButton,
                backgroundColor:
                  selectedStatus === key ? getStatusColor(key) : "white",
                color: selectedStatus === key ? "white" : "#495057"
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-4">
        {filteredTask.map((task) => (
          <div
            key={task._id}
            className="card"
            style={{
              ...modernStyles.taskCard,
              width: "18%"
            }}
          >
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5
                  className="mb-0"
                  style={{ color: "#2c3e50", fontWeight: "600" }}
                >
                  {task.tName}
                </h5>
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
              </div>

              <p className="text-muted">{task.description}</p>

              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span>Deadline:</span>
                  <strong>
                    {new Date(task.deadLine).toLocaleDateString()}
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Start Date:</span>
                  <strong>
                    {new Date(task.startDate).toLocaleDateString()}
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Priority:</span>
                  <strong style={{ color: getPriorityColor(task.priority) }}>
                    {task.priority}
                  </strong>
                </div>
              </div>

              <div className="mt-3">
                {editingTaskId === task._id ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleSave(task._id, task.empID)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-light w-100"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit Status
                  </button>
                )}
              </div>
            </div>
            <div
              style={{
                height: "4px",
                backgroundColor: getPriorityColor(task.priority),
                marginTop: "auto"
              }}
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-dark mt-4"
        onClick={downloadTasksAsPDF}
        style={{
          borderRadius: "10px",
          padding: "0.75rem 1.5rem"
        }}
      >
        Download PDF Report
      </button>
    </div>
  );
}
