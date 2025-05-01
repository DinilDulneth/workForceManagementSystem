import React, { useEffect, useState, useRef } from "react";

import "./MDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Chart from "chart.js/auto";
import "./dashboardOverview.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../../assets/images/logo1.png";

export default function DashboardOverView() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({});
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getTaskStatusLabel = (status) => {
    const statusLabels = {
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
    return statusLabels[status] || "Unknown";
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
    const getDailyprogress = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/task/overallProgressEachDay"
        );
        const progressData = res.data.progress;

        // Sort the dates and get the latest 5 days
        const sortedDates = Object.keys(progressData).sort(
          (a, b) => new Date(b) - new Date(a)
        );
        const latestDates = sortedDates.slice(0, 8).reverse(); // Get the latest 5 days and reverse to maintain chronological order
        const latestProgress = latestDates.map((date) => progressData[date]);

        setDailyProgress(latestProgress);

        if (chartRef.current) {
          chartRef.current.destroy(); // Destroy previous instance
        }

        const ctx = canvasRef.current.getContext("2d");

        chartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: latestDates,
            datasets: [
              {
                label: "Daily Progress = total of task / Working Hours",
                data: latestProgress,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                pointRadius: 5,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true }
            }
          }
        });
      } catch (err) {
        console.error("Error fetching employees Progress:", err);
      }
    };

    const getEmployee = async () => {
      try {
        const res = await axios.get("http://localhost:8070/employee/getEmp");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    const getTask = async () => {
      try {
        const res = await axios.get("http://localhost:8070/task/");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    getEmployee();
    getTask();
    getDailyprogress();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up on unmount
      }
    };
  }, []);

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

  return (
    <div className={`main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
      <h2 className="mb-4 fw-bold">Dashboard Overview</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card p-3 text-center">
            <i
              className="bi bi-person-badge-fill card-icon text-primary"
              style={{ fontSize: "2rem" }}
            ></i>
            <h6 className="text-muted">Employees</h6>
            <h3 className="mt-2 fw-bold">{employees.length}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card p-3 text-center">
            <i
              className="bi bi-person-check-fill card-icon text-success"
              style={{ fontSize: "2rem" }}
            ></i>
            <h6 className="text-muted">Current Available Employees</h6>
            <h3 className="mt-2 fw-bold">
              {employees.length > 0
                ? employees.filter((emp) => emp.availability === 1).length
                : "0"}
            </h3>
          </div>
        </div>
        <div className="col">
          <div className="card p-3 text-center">
            <i
              className="bi bi-file-earmark-check-fill card-icon text-warning"
              style={{ fontSize: "2rem" }}
            ></i>
            <h6 className="text-muted">Tasks</h6>
            <h3 className="mt-2 fw-bold">{tasks.length}</h3>
          </div>
        </div>
        <div className="col">
          <div className="card p-3 text-center">
            <i
              className="bi bi-clock-fill card-icon text-info"
              style={{ fontSize: "2rem" }}
            ></i>
            <h6 className="text-muted">To Do Task</h6>
            <h3 className="mt-2 fw-bold">
              {tasks.filter((task) => task.status === 1).length}
            </h3>
          </div>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h5 className="mb-3">Daily Employee Progress</h5>
        <div style={{ height: "400px" }}>
          {" "}
          {/* Set a fixed height for the chart container */}
          <canvas ref={canvasRef} id="revenueChart"></canvas>
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
                <th>Employee ID</th>
                <th>Attachment</th>
                <th>Deadline</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
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

                  <td>{task.empID}</td>
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
    </div>
  );
}
