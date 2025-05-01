import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultProfilePic from "../../../assets/images/user_img.jpg";
import "./fetchEmp.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-confirm-alert/src/react-confirm-alert.css";
// import sendTaskNotification from "../../../services/sendEmails"; // Import the sendGmail function

export default function FetchEmp() {
  // Retrieve user data from localStorage
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("Name");
  const role = localStorage.getItem("role");
  const MID = localStorage.getItem("ID");

  const [employees, setEmployees] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded
  const [tasks, setTasks] = useState([]);
  const [tName, setName] = useState("");
  const [description, setdescription] = useState("");
  const [empID, setempID] = useState("");
  const [assignedBy, setassignedBy] = useState(MID);
  const [deadLine, setdeadLine] = useState("");
  const [priority, setpriority] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editedTask, setEditedTask] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const downloadTasksAsPDF = () => {
    // Show a toast notification for starting the download
    toast.info("Preparing your PDF...", {
      position: "top-right",
      autoClose: 2000
    });

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Tasks List", 10, 10);

    // Table
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

    tasks.forEach((task, index) => {
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

    // Add table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    // Save the PDF
    doc.save("Recent_Tasks_List.pdf");

    // Show a toast notification for successful download
    toast.success("PDF downloaded successfully!", {
      position: "top-right",
      autoClose: 2000
    });
  };

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

  useEffect(() => {
    getEmployee();
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

  function getTask(id) {
    axios
      .get(`http://localhost:8070/task/getByEmpID/${id}`)
      .then((res) => {
        const sortedTasks = res.data.task.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setTasks(sortedTasks);
      })
      .catch((err) => {
        console.error("Error fetch Task:", err);
      });
  }

  function setTask(e, id) {
    e.preventDefault();
    const newTask = {
      tName,
      description,
      empID: id,
      assignedBy: MID,
      deadLine,
      priority
    };

    axios
      .post("http://localhost:8070/task/add", newTask)
      .then((res) => {
        // Find employee email from employees array
        const employee = employees.find((emp) => emp._id === id);
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
        setdeadLine("");
        setpriority("");
        // Fetch tasks again to update the list
        getTask(id);
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

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  function handleCancelEdit() {
    setEditingTaskId(null); // Exit edit mode
    setEditedTask({}); // Optional: Clear edited task state
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

  const toggleCard = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null); // Collapse the card
      setTasks([]); // Clear tasks when collapsing
      setempID("");
    } else {
      setExpandedCard(id); // Expand the card
      getTask(id); // Fetch tasks for the selected employee
      setempID(id);
    }
  };
  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.position &&
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.status &&
        employee.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="container py-6 main-block">
        <h2 className="headerName mb-5">Team Overview</h2>
        <div className="mb-4 position-relative search_c">
          <div className="search-wrapper">
            <input
              type="text"
              className="form-control shadow-sm border-0 rounded-pill py-3 px-4 shadow-lg p-3 mb-5 bg-body-tertiary rounded"
              placeholder="Search employees by name, position, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredEmployees.map((employee) => (
            <React.Fragment key={employee._id}>
              <div
                className={`col employeedetails ${
                  expandedCard === employee._id ? "d-none" : ""
                }`}
              >
                <div
                  className={`employee-card ${
                    expandedCard === employee._id ? "d-none" : ""
                  }`}
                >
                  <div className="card-header">
                    <h6 className="mb-0 p-0">{employee.name}</h6>
                  </div>
                  <div className="employee-img-container">
                    <img
                      src={employee.image || defaultProfilePic}
                      className="employee-img"
                      alt={employee.name}
                    />
                  </div>
                  <div className="card-body">
                    <p className="card-text mb-2">
                      <i className="fas fa-user-tie info-icon"></i>
                      <strong>Role:</strong> {employee.position}
                    </p>
                    <p className="card-text mb-2">
                      <i className="fas fa-envelope info-icon"></i>
                      <strong>Email:</strong> {employee.email}
                    </p>
                    <p className="card-text">
                      <i className="fas fa-circle-notch info-icon"></i>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-dot ${
                          employee.status === "Active" ? "" : "status-offline"
                        }`}
                      ></span>{" "}
                      {employee.status}
                    </p>
                  </div>
                  <div className="card-footer text-center border-0">
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                      onClick={() => toggleCard(employee._id)}
                    >
                      <i
                        className={`bi ${
                          expandedCard === employee._id
                            ? "bi-chevron-up"
                            : "bi-eye"
                        }`}
                      ></i>
                      {expandedCard === employee._id
                        ? "Collapse"
                        : "View Task Details"}
                    </button>
                  </div>
                </div>
              </div>
              {expandedCard === employee._id && (
                <div className="col-12">
                  <div className="moreInfoEmpContainer">
                    <div className="moreInfoEmp d-block">
                      <div className="maininfobox">
                        <div className="card-headerMore">
                          <h6 className="mb-0 p-0">{employee.name}</h6>
                        </div>
                        <div className="user-card">
                          <div>
                            <img
                              src="/frontend/media/image/user_img.jpg"
                              alt="User Avatar"
                              className="rounded-circle user-avatar"
                            />
                            <h5 className="mb-2 ml-2">{employee.name}</h5>
                            <h6 className="mb-3 ml-2">{employee.position}</h6>
                          </div>
                          <div>
                            <table className="table table-hover table-striped table-bordered  table-custom">
                              <thead>
                                <tr>
                                  <th style={{ width: "30px" }}>#</th>
                                  <th style={{ width: "132px" }}>Task Name</th>
                                  <th>Description</th>
                                  <th style={{ width: "90px" }}>Attachment</th>
                                  <th style={{ width: "112px" }}>Deadline</th>
                                  <th style={{ width: "112px" }}>Start Date</th>
                                  <th style={{ width: "70px" }}>Priority</th>
                                  <th style={{ width: "90px" }}>Status</th>
                                  <th style={{ width: "137px" }}>Review</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tasks.length > 0 ? (
                                  tasks.map((task, index) => (
                                    <tr key={task._id}>
                                      <td
                                        className="numberR"
                                        style={{ width: "30px" }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td style={{ width: "132px" }}>
                                        {task.tName}
                                      </td>
                                      <td>
                                        {editingTaskId === task._id ? (
                                          <input
                                            type="text"
                                            name="description"
                                            value={editedTask.description || ""}
                                            onChange={handleInputChange}
                                            className="task-deadline-input"
                                          />
                                        ) : (
                                          task.description
                                        )}
                                      </td>
                                      <td style={{ width: "90px" }}>
                                        <span
                                          className="badge m-1"
                                          style={{}}
                                        ></span>
                                        {task.attachmentPath ? (
                                          <a
                                            href={task.attachmentPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            View Attachment
                                          </a>
                                        ) : (
                                          "No Attachment"
                                        )}
                                      </td>
                                      <td style={{ width: "112px" }}>
                                        {editingTaskId === task._id ? (
                                          <input
                                            type="date"
                                            name="deadLine"
                                            value={
                                              editedTask.deadLine
                                                ? editedTask.deadLine.split(
                                                    "T"
                                                  )[0]
                                                : ""
                                            }
                                            onChange={handleInputChange}
                                            className="task-deadline-input"
                                          />
                                        ) : task.deadLine ? (
                                          new Date(
                                            task.deadLine
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                          })
                                        ) : (
                                          "No Deadline"
                                        )}
                                      </td>

                                      <td style={{ width: "112px" }}>
                                        {new Date(
                                          task.startDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td
                                        className=""
                                        style={{ width: "70px" }}
                                      >
                                        {editingTaskId === task._id ? (
                                          <select
                                            name="priority"
                                            value={editedTask.priority || ""}
                                            onChange={handleInputChange}
                                            className="task-deadline-input task_custom_priority"
                                          >
                                            <option value="">
                                              Select Priority...
                                            </option>
                                            <option value="1">
                                              1 - Very Low
                                            </option>
                                            <option value="2">2 - Low</option>
                                            <option value="3">
                                              3 - Below Average
                                            </option>
                                            <option value="4">
                                              4 - Slightly Low
                                            </option>
                                            <option value="5">
                                              5 - Medium
                                            </option>
                                            <option value="6">
                                              6 - Slightly High
                                            </option>
                                            <option value="7">
                                              7 - Above Average
                                            </option>
                                            <option value="8">8 - High</option>
                                            <option value="9">
                                              9 - Very High
                                            </option>
                                            <option value="10">
                                              10 - Critical
                                            </option>
                                          </select>
                                        ) : (
                                          task.priority
                                        )}
                                      </td>
                                      <td style={{ width: "90px" }}>
                                        <span
                                          className="badge m-1"
                                          style={{
                                            backgroundColor: getStatusColor(
                                              task.status
                                            ),
                                            color: "white",
                                            width: "90%",
                                            display: "inline-block"
                                          }}
                                        >
                                          {getTaskStatusLabel(task.status)}
                                        </span>
                                      </td>
                                      <td style={{ width: "122px" }}>
                                        <div className="btn-group" role="group">
                                          {editingTaskId === task._id ? (
                                            <>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-success d-inline btn_sub "
                                                onClick={(e) =>
                                                  editTask(e, task._id, empID)
                                                }
                                              >
                                                ✓ Submit
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary  d-inline btn_sub"
                                                onClick={handleCancelEdit}
                                              >
                                                ← Back
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                  handleEditClick(task)
                                                }
                                              >
                                                ✏️
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                                onClick={() =>
                                                  deleteTask(task._id, empID)
                                                }
                                                style={{
                                                  fontSize: "12px",
                                                  padding: "9px 8px"
                                                }}
                                              >
                                                <i className="bi bi-trash"></i>{" "}
                                                Delete
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="7" className="text-center">
                                      No tasks found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              <button
                                className="btn btn-primary btn-sm mb-3 mt-4"
                                onClick={downloadTasksAsPDF}
                                style={{ width: "120px" }}
                              >
                                Download PDF
                              </button>
                            </table>

                            <span
                              className="fw-bold text-muted small"
                              style={{ fontSize: "16px" }}
                            >
                              <i className="bi bi-plus-circle"></i> Add new Task
                            </span>

                            <div className="add-task">
                              <div className="input-group">
                                <form
                                  className="input-group"
                                  onSubmit={(e) => setTask(e, employee._id)}
                                >
                                  <input
                                    type="text"
                                    className=" mb-0 form-control"
                                    placeholder="Task Name..."
                                    value={tName}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                  />
                                  <input
                                    type="text"
                                    className="mb-0 form-control"
                                    placeholder="Task Description..."
                                    value={description}
                                    onChange={(e) =>
                                      setdescription(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    type="date"
                                    className="mb-0 form-control"
                                    placeholder="Task Deadline..."
                                    value={deadLine}
                                    onChange={(e) =>
                                      setdeadLine(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                  />

                                  <input
                                    type="text"
                                    className="mb-0 form-control"
                                    hidden
                                    readOnly
                                    value={assignedBy}
                                    onChange={(e) =>
                                      setassignedBy(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    type="text"
                                    className="mb-0 form-control"
                                    hidden
                                    readOnly
                                    value={employee._id}
                                    onChange={(e) => setempID(e.target.value)}
                                    required
                                  />
                                  <select
                                    className="mb-0 form-control"
                                    style={{ marginLeft: "0px" }}
                                    value={priority}
                                    onChange={(e) =>
                                      setpriority(e.target.value)
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
                                  <button
                                    className="btn btn-outline-secondary "
                                    type="submit"
                                  >
                                    +Add
                                  </button>
                                </form>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="rating">
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-secondary btn-sm d-flex align-items-center gap-1 mt-0 m-3"
                          onClick={() => toggleCard(employee._id)}
                        >
                          <i className="bi bi-arrow-left"></i> Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
