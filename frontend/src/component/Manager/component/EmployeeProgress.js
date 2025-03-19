import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeProgress.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function EmployeeProgress() {
  const { id } = useParams();
  const [progressData, setProgressData] = useState({});
  const [workingHData, setWorkingHData] = useState({});
  const [employee, setEmployee] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getDayToDayProgress(id);
    getEmployeeWorkingHours(id);
    getEmployeeDetails(id);
    getTask(id);
  }, [id]);

  const getTaskStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "To Do";
      case 2:
        return "In Progress";
      case 3:
        return "Completed";
      case 4:
        return "Pending";
      case 5:
        return "On Hold";
      case 6:
        return "Cancelled";
      case 7:
        return "Not Started";
      case 8:
        return "Overdue";
      case 9:
        return "Review Required";
      case 10:
        return "Blocked";
      case 11:
        return "Deferred";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 2:
        return "green";
      case 7:
        return "red";
      case 1:
      case 3:
      case 6:
        return "orange";
      case 4:
      case 9:
      case 10:
        return "gray";
      case 5:
        return "darkgray";
      default:
        return "black";
    }
  };

  function getTask(id) {
    axios
      .get(`http://localhost:8070/task/getByEmpID/${id}`)
      .then((res) => {
        const sortedTasks = res.data.task.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setTasks(sortedTasks);
        console.log(sortedTasks);
      })
      .catch((err) => {
        console.error("Error fetching Task:", err);
      });
  }

  function getDayToDayProgress(id) {
    axios
      .get(`http://localhost:8070/task/overallProgressEachDayByID/${id}`)
      .then((res) => {
        console.log(res.data.progress);
        setProgressData(res.data.progress);
      })
      .catch((err) => {
        console.error("Error fetching progress data:", err);
      });
  }

  function getEmployeeWorkingHours(id) {
    axios
      .get(`http://localhost:8070/workingH/getByEmpID/${id}`)
      .then((res) => {
        console.log(res.data.workingH);

        const workingHoursByDate = res.data.workingH.reduce((acc, curr) => {
          const date = new Date(curr.date).toISOString().split("T")[0];
          acc[date] = parseInt(curr.wHours);
          return acc;
        }, {});

        console.log(workingHoursByDate);
        setWorkingHData(workingHoursByDate);
      })
      .catch((err) => {
        console.error("Error fetching working hours data:", err);
      });
  }

  function getEmployeeDetails(id) {
    axios
      .get(`http://localhost:8070/employee/getEmpByID/${id}`)
      .then((res) => {
        setEmployee(res.data);
        console.log(res.data);
      })

      .catch((err) => {
        console.error("Error fetching employee details:", err);
      });
  }

  const prepareDonutChartData = (tasks, statusFilter) => {
    const statusCounts = tasks.reduce((acc, task) => {
      const statusLabel = getTaskStatusLabel(task.status);
      if (statusFilter.includes(statusLabel)) {
        acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      }
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
            "#9966FF"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF"
          ]
        }
      ]
    };
  };

  const prepareChartData = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    const formattedLabels = labels.map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    );

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: "Daily Progress",
          data: values,
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.2
        }
      ]
    };
  };

  const prepareWorkingHoursChartData = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    const formattedLabels = labels.map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    );

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: "Daily Working Hours",
          data: values,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptionsWorkingH = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333"
        }
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.5,
          callback: (value) => value.toFixed(3),
          color: "#666"
        },
        title: {
          display: true,
          text: "Working Hours",
          font: { size: 14, weight: "bold" },
          color: "#333"
        },
        grid: { color: "rgba(0, 0, 0, 0.1)" }
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: { size: 14, weight: "bold" },
          color: "#333"
        },
        ticks: {
          color: "#666",
          maxRotation: 35,
          minRotation: 35
        },
        grid: { display: false }
      }
    },
    animation: {
      duration: 900,
      easing: "easeOutQuart"
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333"
        }
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.05,
          callback: (value) => value.toFixed(3),
          color: "#666"
        },
        title: {
          display: true,
          text: "Progress Value",
          font: { size: 14, weight: "bold" },
          color: "#333"
        },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        min: 0,
        max: 0.2
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: { size: 14, weight: "bold" },
          color: "#333"
        },
        ticks: {
          color: "#666",
          maxRotation: 35,
          minRotation: 35
        },
        grid: { display: false }
      }
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart"
    }
  };

  return (
    <div className="container main-block main_block">
      <div>
        <h2 className="headerName mb-2">{employee.name}'s Progress</h2>
        <div className="Main1stLeyer">
          {/* Employee Information Card */}
          <div className="Information_Card box_es">
            <div className="">
              <h5 className="card-title">{employee.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {employee.position}
              </h6>
              <p className="card-text">
                Department: {employee.department}
                <br />
                Email: {employee.email}
                <br />
                Phone: {employee.phone}
                <br />
                Salary: {employee.salary}
                <br />
                Date of Joining:{" "}
                {new Date(employee.dateOfJoining).toLocaleDateString()}
                <br />
                Availability: {employee.availability}
              </p>
            </div>
          </div>

          {/* Tasks Status Chart */}
          <div className="Status_Chart chart1 box_es">
            <h5 className="headerName">To do Tasks Status</h5>
            <div
              className="chart-container chart_d"
              style={{ height: "200px", width: "200px", marginTop: "40px" }}
            >
              <Doughnut data={prepareDonutChartData(tasks, ["To Do"])} />
            </div>
          </div>
          {/* Overall Tasks Status Chart */}
          <div className="Status_Chart chart2 box_es">
            <h5 className="headerName">Overall Tasks Status</h5>
            <div
              className=""
              style={{ height: "200px", width: "200px", marginTop: "40px" }}
            >
              <Doughnut
                data={prepareDonutChartData(tasks, [
                  "To Do",
                  "In Progress",
                  "Completed",
                  "Pending",
                  "On Hold",
                  "Cancelled",
                  "Not Started",
                  "Overdue",
                  "Review Required",
                  "Blocked",
                  "Deferred",
                  "Unknown"
                ])}
              />
            </div>
          </div>
        </div>

        {/* Day-to-Day Progress Chart */}
        <div
          className="chart-container card p-4 mr-4 mt-4 mb-5"
          style={{ height: "400px", width: "94%" }}
        >
          <h5>Day-to-Day Progress</h5>
          <Line data={prepareChartData(progressData)} options={chartOptions} />
        </div>

        {/* Daily Working Hours Chart */}
        <div
          className="chart-container card p-4 mr-4 mt-4 mb-5"
          style={{ height: "400px", width: "94%" }}
        >
          <h5>Daily Working Hours</h5>
          <Bar
            data={prepareWorkingHoursChartData(workingHData)}
            options={chartOptionsWorkingH}
          />
        </div>
      </div>
    </div>
  );
}
