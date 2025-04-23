import React, { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";

export default function EmployeeHome() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [progressData, setProgressData] = useState({});
  const [workingHData, setWorkingHData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const downloadTasksAsPDF = () => {
    // Show a toast notification for starting the download
    toast.info("Preparing your PDF...", {
      position: "top-right",
      autoClose: 2000
    });

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Recent Tasks List", 10, 10);

    // Table
    const tableColumn = [
      "Task No.",
      "Task Name",
      "Description",
      "Status",
      // "Employee ID",
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
        // task.empID,
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
  useEffect(() => {
    const id = localStorage.getItem("ID");
    if (id) {
      getDayToDayProgress(id);
      getEmployeeWorkingHours(id);
      getTask(id);
    }
  }, []);
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
  // Filter tasks based on search term and selected status
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

  const getDayToDayProgress = (id) => {
    axios
      .get(`http://localhost:8070/task/overallProgressEachDayByID/${id}`)
      .then((res) => setProgressData(res.data.progress))
      .catch((err) => console.error("Error fetching progress data:", err));
  };

  const getEmployeeWorkingHours = (id) => {
    axios
      .get(`http://localhost:8070/workingH/getByEmpID/${id}`)
      .then((res) => {
        const workingHoursByDate = res.data.workingH.reduce((acc, curr) => {
          const date = new Date(curr.date).toISOString().split("T")[0];
          acc[date] = parseInt(curr.wHours);
          return acc;
        }, {});
        setWorkingHData(workingHoursByDate);
      })
      .catch((err) => console.error("Error fetching working hours data:", err));
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

  const prepareDonutChartData = (tasks) => {
    const statusCounts = tasks.reduce((acc, task) => {
      const statusLabel = getTaskStatusLabel(task.status);
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FFCD56",
            "#C9CBCF",
            "#FF6384"
          ]
        }
      ]
    };
  };

  return (
    <div
      className="container py-3"
      style={{
        maxWidth: "83%",
        margin: "0 auto",
        marginLeft: "250px",
        marginTop: "70px"
      }}
    >
      <h3 className="mb-4">Dashboard Overview</h3>

      {/* Overview Cards */}
      <div className="row mb-4">
        {[
          {
            title: "Total Tasks",
            value: tasks.length,
            color: "#17a2b8",
            icon: "fas fa-tasks"
          },
          {
            title: "Completed Tasks",
            value: tasks.filter(
              (task) => getTaskStatusLabel(task.status) === "Completed"
            ).length,
            color: "#28a745",
            icon: "fas fa-check-circle"
          },
          {
            title: "Progress",
            value: `${progress.toFixed(2)}%`,
            color: "#ffc107",
            icon: "fas fa-chart-line"
          },
          {
            title: "To Do",
            value: tasks.filter(
              (task) => getTaskStatusLabel(task.status) === "To Do"
            ).length,
            color: "#dc3545",
            icon: "fas fa-list"
          }
        ].map((card, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="card text-center shadow-sm"
              style={{
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#f8f9fa",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                cursor: "pointer",
                height: "130px"
              }}
            >
              <div className="card-body p-2">
                <div
                  style={{
                    fontSize: "30px",
                    color: card.color,
                    marginBottom: "10px"
                  }}
                >
                  <i className={card.icon}></i>
                </div>
                <h5
                  className="card-title"
                  style={{
                    fontWeight: "600",
                    color: "#343a40",
                    fontSize: "16px"
                  }}
                >
                  {card.title}
                </h5>
                <p
                  className="card-text display-6"
                  style={{
                    color: card.color,
                    fontWeight: "700",
                    margin: "0",
                    fontSize: "26px"
                  }}
                >
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">Progress Over Time</div>
            <div className="card-body">
              <Line
                data={{
                  labels: Object.keys(progressData),
                  datasets: [
                    {
                      label: "Progress",
                      data: Object.values(progressData),
                      borderColor: "#36A2EB",
                      backgroundColor: "rgba(54, 162, 235, 0.2)",
                      tension: 0.4
                    }
                  ]
                }}
                options={{ responsive: true }}
              />
            </div>
          </div>
          {/* Quick Access Section */}
          <div className="card shadow-sm mt-3 mb-4">
            <div className="card-header">
              <h5>Quick Access</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/Fetchinquiry")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-question-circle me-2"></i> Inquiry List
                  </button>
                </div>
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/LeaveRequest")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-plane-departure me-2"></i> Leave
                    Request
                  </button>
                </div>
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-warning w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/ViewTask")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-tasks me-2"></i> View Task
                  </button>
                </div>
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-info w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/FetchFeedback")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-comments me-2"></i> Feedback
                  </button>
                </div>
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-secondary w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/fetchAnnouncement")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-bullhorn me-2"></i> Announcements
                  </button>
                </div>
                <div className="col-md-4 mb-3">
                  <button
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      (window.location.href = "/EmployeeHome/ResignationF")
                    }
                    style={{ height: "60px" }}
                  >
                    <i className="fas fa-file-alt me-2"></i> Resignation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">Task Distribution</div>
            <div className="card-body p-5">
              <Doughnut
                data={prepareDonutChartData(tasks)}
                options={{ responsive: true }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="card p-3">
        <h5 className="mb-3">Recent Tasks</h5>

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

        <div
          className="table-responsive"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="table table-hover">
            <thead
              className="table-dark"
              style={{ position: "sticky", top: "0", zIndex: "1000" }}
            >
              <tr>
                <th>Task No.</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Status</th>
                {/* <th>Employee ID</th> */}
                <th>Deadline</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {filteredTask.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.tName}</td>
                  <td>{task.description}</td>
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

                  {/* <td>{task.empID}</td> */}
                  <td>{new Date(task.deadLine).toLocaleDateString()}</td>
                  <td>{new Date(task.startDate).toLocaleDateString()}</td>
                  <td>
                    {task.endDate
                      ? new Date(task.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{task.priority}</td>
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
      {/* Calendar */}
      <div className="card mb-4 mt-3 shadow-sm">
        <div className="card-header">
          <h5>Calendar</h5>
        </div>
        <div className="card-body">
          <Calendar
            value={date}
            onChange={setDate}
            tileClassName={({ date, view }) => {
              // Highlight dates with tasks
              if (
                tasks.some(
                  (task) =>
                    new Date(task.deadLine).toDateString() ===
                    date.toDateString()
                )
              ) {
                return "task-date"; // Add a custom class for task dates
              }
            }}
          />
          <p className="mt-3">Selected Date: {date.toDateString()}</p>

          {/* Task Details for Selected Date */}
          <div className="mt-4">
            <h6>Tasks for {date.toDateString()}:</h6>
            <ul className="list-group">
              {tasks
                .filter(
                  (task) =>
                    new Date(task.deadLine).toDateString() ===
                    date.toDateString()
                )
                .map((task) => (
                  <li key={task.id} className="list-group-item">
                    <strong>{task.tName}</strong> - {task.priority} Priority (
                    {getTaskStatusLabel(task.status)})
                  </li>
                ))}
              {tasks.filter(
                (task) =>
                  new Date(task.deadLine).toDateString() === date.toDateString()
              ).length === 0 && (
                <li className="list-group-item">No tasks for this date.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
