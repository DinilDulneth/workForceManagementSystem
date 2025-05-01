import React, { useState, useEffect, useRef } from "react";
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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const fileInputRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({});

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
  // First, add a function to fetch employee details
  // Update the getEmployeeDetails function
  const getEmployeeDetails = async (empId) => {
    try {
      const response = await axios.get(
        `http://localhost:8070/employee/getEmpByID/${empId}`
      );
      if (!response.data) {
        throw new Error("Employee not found");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw error;
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({ status: task.status.toString() });
  };

  const handleStatusChange = (e) => {
    setEditedTask({ ...editedTask, status: e.target.value });
  };

  const handleSave = async (taskId, empId) => {
    if (!editedTask.status) {
      Swal.fire({
        icon: "error",
        title: "Status Required",
        text: "Please select a status before saving."
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we update the task status",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const updateTask = {
        status: parseInt(editedTask.status),
        empID: empId
      };

      // Update task status - Fixed API endpoint URL
      const taskResponse = await axios.put(
        `http://localhost:8070/task/updateStatus/${taskId}`, // Changed from updateStatus to update
        updateTask
      );

      if (taskResponse.data) {
        // If task is marked as completed (status 3)
        if (updateTask.status === 3) {
          try {
            // Get employee details
            const employeeDetails = await getEmployeeDetails(empId);

            // Send completion notification
            await sendTaskCompletedNotification(
              taskResponse.data.task || taskResponse.data, // Handle both response formats
              employeeDetails,
              taskResponse.data.task?.assignedBy || taskResponse.data.assignedBy
            );
          } catch (notificationError) {
            console.error("Error sending notification:", notificationError);
            // Continue with update even if notification fails
          }
        }

        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, status: parseInt(editedTask.status) }
              : task
          )
        );

        // Reset editing state
        setEditingTaskId(null);
        setEditedTask({ status: "" });

        // Show success message
        Swal.fire("Success!", "Task Added Successfully! ✅", "success");

        // Refresh task list
        getTask(empId);
      }
    } catch (error) {
      console.error("Error updating task:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Failed to update task status. Please try again.",
        confirmButtonColor: "#3085d6"
      });
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedTask({ status: "" });
  };

  // Update the sendTaskCompletedNotification function to use axios instead of fetch
  const sendTaskCompletedNotification = async (
    taskDetails,
    employeeDetails,
    managerEmail
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8070/api/gmail/send-task-completed-notification",
        {
          taskDetails,
          employeeDetails,
          managerEmail
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        console.log("Notification sent successfully:", response.data.message);
        return true;
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  // Validate file
  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/x-chess-pgn"
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload only PDF, JPG, PNG, or PGN files",
        confirmButtonColor: "#3085d6"
      });
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size should not exceed 5MB",
        confirmButtonColor: "#3085d6"
      });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e, taskId) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setSelectedTaskId(taskId);
      Swal.fire({
        icon: "info",
        title: "File Selected",
        text: `Selected file: ${selectedFile.name}`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      setFile(null);
      setSelectedTaskId(null);
      e.target.value = null;
    }
  };

  // Handle attach file
  const handleAttachFile = async (task) => {
    if (!file || selectedTaskId !== task._id) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Selection",
        text: "Please select a file for this task",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [task._id]: true }));
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData object

    try {
      const loadingSwal = Swal.fire({
        title: "Uploading...",
        html: `
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
      `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.put(
        `http://localhost:8070/task/uploadTaskAttachment/${task._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            const progressBar = document.querySelector(".progress-bar");
            if (progressBar) {
              progressBar.style.width = `${percentCompleted}%`;
              progressBar.textContent = `${percentCompleted}%`;
            }
          },
          timeout: 30000
        }
      );

      await loadingSwal.close();
      await Swal.fire({
        icon: "success",
        title: "Attachment Uploaded!",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false
      });

      // Update local state with new attachmentPath
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id
            ? { ...t, attachmentPath: response.data.task.attachmentPath }
            : t
        )
      );

      // Reset file state
      setFile(null);
      setSelectedTaskId(null);
      const fileInput = document.querySelector(
        `input[data-task-id="${task._id}"]`
      );
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      let errorMessage = "Something went wrong while uploading the attachment";

      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Could not reach the server. Please check your connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Upload timed out. Please try again.";
      }

      await Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Try Again",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          handleAttachFile(task);
        }
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [task._id]: false }));
    }
  };

  // Trigger file input click
  const triggerFileInput = (taskId) => {
    const fileInput = document.querySelector(`input[data-task-id="${taskId}"]`);
    if (fileInput) {
      fileInput.click();
    }
  };

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
        boxShadow: "0 8px 12px rgb(114, 114, 114)"
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

              {/* Display current attachment */}
              {task.attachmentPath && (
                <div className="mt-2">
                  <span>Attachment:</span>
                  <a
                    href={task.attachmentPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    View
                  </a>
                </div>
              )}

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

              {/* File upload section */}
              <div className="mt-3">
                <input
                  type="file"
                  data-task-id={task._id}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, task._id)}
                  accept=".pdf,.jpg,.jpeg,.png,.pgn"
                  disabled={loadingStates[task._id] || false}
                />
                <button
                  className="btn w-100 mb-2"
                  onClick={() => triggerFileInput(task._id)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white"
                  }}
                  disabled={loadingStates[task._id] || false}
                >
                  {loadingStates[task._id] ? "Processing..." : "Attach File"}
                </button>
                {file && selectedTaskId === task._id && (
                  <div className="mt-2">
                    <small className="text-muted">Selected: {file.name}</small>
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => handleAttachFile(task)}
                      disabled={loadingStates[task._id] || false}
                    >
                      {loadingStates[task._id] ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Uploading...
                        </span>
                      ) : (
                        "Upload File"
                      )}
                    </button>
                  </div>
                )}
                {task.attachmentPath && (
                  <div className="mt-2">
                    <a
                      href={task.attachmentPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary w-100"
                    >
                      View Attachment
                    </a>
                  </div>
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
