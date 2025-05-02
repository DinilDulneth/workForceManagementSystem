"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Search,
  FileText,
  Users,
  Briefcase,
  Shield,
  Activity,
  PieChart,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
// Import the logo directly
import companyLogoImg from "../../../public/logo1.png";
import Swal from "sweetalert2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Chart colors
const chartColors = [
  "#fc6625", // Primary brand color
  "#3498db",
  "#9b59b6",
  "#2ecc71",
  "#f1c40f",
  "#e74c3c",
  "#1abc9c",
  "#34495e",
  "#d35400",
  "#16a085",
];

export default function AccessView() {
  const navigate = useNavigate();
  const [accessRecords, setAccessRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name"); // Default filter by name
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // active or revoked
  const [departmentChartData, setDepartmentChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    getAccessRecords();
    fetchDashboardData();

    // Initialize Bootstrap dropdowns
    if (typeof document !== "undefined") {
      const bootstrap = require("bootstrap");
      const dropdownElementList = [].slice.call(
        document.querySelectorAll(".dropdown-toggle")
      );
      dropdownElementList.map(
        (dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl)
      );
    }
  }, []);

  // Update chart data when employee or manager data changes
  useEffect(() => {
    if (employeeData.length > 0 || managerData.length > 0) {
      updateDepartmentChartData();
    }
  }, [employeeData, managerData]);

  const updateDepartmentChartData = () => {
    const allUsers = [...employeeData, ...managerData];
    const deptCounts = allUsers.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});

    const departments = Object.keys(deptCounts);
    const counts = Object.values(deptCounts);

    setDepartmentChartData({
      labels: departments,
      datasets: [
        {
          data: counts,
          backgroundColor: departments.map(
            (_, i) => chartColors[i % chartColors.length]
          ),
          borderColor: departments.map((_, i) =>
            chartColors[i % chartColors.length].replace("1)", "0.8)")
          ),
          borderWidth: 1,
        },
      ],
    });
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const [employees, managers, hrs] = await Promise.all([
        axios.get("http://localhost:8070/employee/getEmp"),
        axios.get("http://localhost:8070/manager/getManager"),
        axios.get("http://localhost:8070/hr/getHR"),
      ]);

      setEmployeeData(employees.data);
      setManagerData(managers.data);
      setHrData(hrs.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load some dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  };

  function getAccessRecords() {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8070/access/getAccess`, { timeout: 5000 })
      .then((res) => {
        setAccessRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching access records:", err);
        setError("Could not connect to the server. Please try again later.");
        setLoading(false);
      });
  }

  function deleteAccess(id) {
    if (window.confirm("Are you sure you want to delete this access record?")) {
      axios
        .delete(`http://localhost:8070/access/deleteAccess/${id}`)
        .then(() => {
          Swal.fire("Access record deleted successfully");
          setAccessRecords(accessRecords.filter((record) => record._id !== id));
        })
        .catch((err) => {
          Swal.fire("Error deleting record: " + err.message);
        });
    }
  }

  function revokeAccess(id) {
    if (window.confirm("Are you sure you want to revoke this user's access?")) {
      axios
        .patch(`http://localhost:8070/access/revokeAccess/${id}`)
        .then(() => {
          Swal.fire("Access revoked successfully");
          getAccessRecords(); // Refresh the records
        })
        .catch((err) => {
          Swal.fire("Error revoking access: " + err.message);
        });
    }
  }

  function restoreAccess(id) {
    if (
      window.confirm("Are you sure you want to restore this user's access?")
    ) {
      axios
        .patch(`http://localhost:8070/access/updateAccess/${id}`, {
          access: "1",
          status: "1",
        })
        .then(() => {
          Swal.fire("Access restored successfully");
          getAccessRecords();
        })
        .catch((err) => {
          Swal.fire("Error restoring access: " + err.message);
        });
    }
  }

  const handleRetry = () => {
    getAccessRecords();
  };

  // Filter records based on search term and filter criteria
  const filterRecords = (records) => {
    if (!searchTerm) return records;

    return records.filter((record) => {
      const value = record[filterBy]?.toString().toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });
  };

  // Get filtered active and revoked users
  const filteredActiveUsers = filterRecords(
    accessRecords.filter((record) => record.access !== "99")
  );
  const filteredRevokedUsers = filterRecords(
    accessRecords.filter((record) => record.access === "99")
  );

  // Function to generate PDF
  const generatePDF = (recordType = "all") => {
    setIsGeneratingPDF(true);

    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add company logo
      try {
        const imgWidth = 40;
        const imgHeight = 20;
        const xPos = (pageWidth - imgWidth) / 2; // Center the logo
        doc.addImage(companyLogoImg, "PNG", xPos, 10, imgWidth, imgHeight);
      } catch (imgError) {
        console.error("Error adding image to PDF:", imgError);
        // Fallback to text
        doc.setFontSize(20);
        doc.setTextColor(252, 102, 37); // #fc6625
        doc.text("WorkSync", pageWidth / 2, 20, { align: "center" });
      }

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80); // #2c3e50
      doc.text("Access Management Report", pageWidth / 2, 40, {
        align: "center",
      });

      // Add date
      const today = new Date();
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
        pageWidth / 2,
        48,
        {
          align: "center",
        }
      );

      // Add summary
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text(`Total Users: ${accessRecords.length}`, 14, 60);
      doc.text(
        `Active Users: ${
          accessRecords.filter((r) => r.access !== "99" && r.status === "1")
            .length
        }`,
        14,
        68
      );
      doc.text(
        `Revoked Users: ${
          accessRecords.filter((r) => r.access === "99").length
        }`,
        14,
        76
      );

      // Determine which records to include
      let recordsToInclude = [];
      if (recordType === "active" || recordType === "all") {
        recordsToInclude = [...filteredActiveUsers];
      }

      if (recordType === "revoked" || recordType === "all") {
        recordsToInclude = [...recordsToInclude, ...filteredRevokedUsers];
      }

      // Format data for the table
      const tableData = recordsToInclude.map((record) => [
        record.name,
        record.email,
        record.department,
        record.position,
        record.access === "99"
          ? "Revoked"
          : record.status === "1"
          ? "Active"
          : record.status === "2"
          ? "On Leave"
          : "Inactive",
      ]);

      // Add the table
      doc.autoTable({
        startY: 85,
        head: [["Name", "Email", "Department", "Position", "Status"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [44, 62, 80], // #2c3e50
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        styles: {
          fontSize: 10,
        },
      });

      // Add search filter info if applied
      if (searchTerm) {
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 85;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Filtered by: ${filterBy} containing "${searchTerm}"`,
          14,
          finalY + 10
        );
      }

      // Save the PDF
      const fileName = `access_report_${recordType}_${
        today.toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Manual dropdown toggle function (in case Bootstrap JS isn't working)
  const toggleDropdown = () => {
    const dropdown = document.getElementById("exportDropdownMenu");
    if (dropdown) {
      dropdown.classList.toggle("show");
    }
  };

  // Get department distribution data
  const getDepartmentDistribution = () => {
    const allUsers = [...employeeData, ...managerData];
    const deptCounts = allUsers.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(deptCounts);
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div style={modernStyles.loadingContainer}>
        <div style={modernStyles.loadingContent}>
          <h3 style={modernStyles.loadingTitle}>Access Records</h3>
          <div
            className="spinner-border"
            role="status"
            style={modernStyles.spinner}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={modernStyles.loadingText}>Loading access records...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={modernStyles.mainContent}>
      <div style={modernStyles.contentWrapper}>
        {/* Page Header */}
        <div style={modernStyles.pageHeader}>
          <h1 style={modernStyles.pageTitle}>HR Dashboard</h1>
          <div style={modernStyles.pdfControls}>
            <button
              className="btn dropdown-toggle"
              type="button"
              id="exportDropdown"
              onClick={toggleDropdown}
              disabled={isGeneratingPDF}
              style={modernStyles.exportButton}
            >
              <FileText size={16} style={{ marginRight: "8px" }} />
              Export PDF
              {isGeneratingPDF && (
                <div
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                  style={{ color: "white" }}
                >
                  <span className="visually-hidden">Generating PDF...</span>
                </div>
              )}
            </button>
            <ul
              className="dropdown-menu shadow-lg"
              id="exportDropdownMenu"
              aria-labelledby="exportDropdown"
              style={modernStyles.dropdownMenu}
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => generatePDF("all")}
                  disabled={isGeneratingPDF}
                >
                  All Users
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => generatePDF("active")}
                  disabled={isGeneratingPDF}
                >
                  Active Users Only
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => generatePDF("revoked")}
                  disabled={isGeneratingPDF}
                >
                  Revoked Users Only
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div style={modernStyles.dashboardSection}>
          <div style={modernStyles.sectionHeader}>
            <h2 style={modernStyles.sectionTitle}>
              <Activity size={20} style={{ marginRight: "8px" }} />
              Overview
            </h2>
          </div>

          <div style={modernStyles.statsGrid}>
            {/* Summary Card */}
            <div style={modernStyles.statCard}>
              <div style={modernStyles.statHeader}>
                <div style={modernStyles.statIconContainer}>
                  <Users size={20} color="#fff" />
                </div>
                <h3 style={modernStyles.statTitle}>Workforce Summary</h3>
              </div>
              <div style={modernStyles.statContent}>
                <div style={modernStyles.statItem}>
                  <span>Total Employees</span>
                  <strong style={modernStyles.statValue}>
                    {employeeData.length}
                  </strong>
                </div>
                <div style={modernStyles.statItem}>
                  <span>Total Managers</span>
                  <strong style={modernStyles.statValue}>
                    {managerData.length}
                  </strong>
                </div>
                <div style={modernStyles.statItem}>
                  <span>HR Staff</span>
                  <strong style={modernStyles.statValue}>
                    {hrData.length}
                  </strong>
                </div>
                <div style={modernStyles.statItem}>
                  <span>Total Workforce</span>
                  <strong style={modernStyles.statHighlight}>
                    {employeeData.length + managerData.length + hrData.length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Department Distribution - Pie Chart */}
            <div style={modernStyles.statCard}>
              <div style={modernStyles.statHeader}>
                <div style={modernStyles.statIconContainer}>
                  <PieChart size={20} color="#fff" />
                </div>
                <h3 style={modernStyles.statTitle}>Department Distribution</h3>
              </div>
              <div style={modernStyles.chartContainer}>
                {departmentChartData.labels.length > 0 ? (
                  <Pie data={departmentChartData} options={chartOptions} />
                ) : (
                  <div style={modernStyles.chartLoading}>
                    <p>Loading department data...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Access Status */}
            <div style={modernStyles.statCard}>
              <div style={modernStyles.statHeader}>
                <div style={modernStyles.statIconContainer}>
                  <Shield size={20} color="#fff" />
                </div>
                <h3 style={modernStyles.statTitle}>Access Status</h3>
              </div>
              <div style={modernStyles.statContent}>
                <div style={modernStyles.statItem}>
                  <span>Active Users</span>
                  <div style={modernStyles.statusBadgeContainer}>
                    <span
                      style={{
                        ...modernStyles.statusBadge,
                        backgroundColor: "#2ecc71",
                      }}
                    >
                      {
                        accessRecords.filter(
                          (r) => r.access !== "99" && r.status === "1"
                        ).length
                      }
                    </span>
                  </div>
                </div>
                <div style={modernStyles.statItem}>
                  <span>On Leave</span>
                  <div style={modernStyles.statusBadgeContainer}>
                    <span
                      style={{
                        ...modernStyles.statusBadge,
                        backgroundColor: "#f1c40f",
                      }}
                    >
                      {accessRecords.filter((r) => r.status === "2").length}
                    </span>
                  </div>
                </div>
                <div style={modernStyles.statItem}>
                  <span>Revoked Access</span>
                  <div style={modernStyles.statusBadgeContainer}>
                    <span
                      style={{
                        ...modernStyles.statusBadge,
                        backgroundColor: "#e74c3c",
                      }}
                    >
                      {accessRecords.filter((r) => r.access === "99").length}
                    </span>
                  </div>
                </div>
                <div style={modernStyles.statItem}>
                  <span>Total Users</span>
                  <div style={modernStyles.statusBadgeContainer}>
                    <span
                      style={{
                        ...modernStyles.statusBadge,
                        backgroundColor: "#34495e",
                      }}
                    >
                      {accessRecords.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Management Section */}
        <div style={modernStyles.accessSection}>
          <div style={modernStyles.sectionHeader}>
            <h2 style={modernStyles.sectionTitle}>
              <Shield size={20} style={{ marginRight: "8px" }} />
              Access Management
            </h2>
          </div>

          {error && (
            <div
              style={modernStyles.alertBox}
              className="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              <strong>Note:</strong> {error}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
              <div className="mt-2">
                <button
                  className="btn btn-sm"
                  onClick={handleRetry}
                  style={modernStyles.retryButton}
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div style={modernStyles.searchContainer}>
            <div style={modernStyles.searchInputWrapper}>
              <Search size={20} style={modernStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={modernStyles.searchInput}
                className="form-control"
              />
            </div>
            <div style={modernStyles.filterSelect}>
              <select
                id="filterBy"
                className="form-select"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={modernStyles.selectInput}
              >
                <option value="name">Filter by Name</option>
                <option value="email">Filter by Email</option>
                <option value="department">Filter by Department</option>
                <option value="position">Filter by Position</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div style={modernStyles.tabsContainer}>
            <button
              style={{
                ...modernStyles.tabButton,
                ...(activeTab === "active" ? modernStyles.activeTab : {}),
              }}
              onClick={() => setActiveTab("active")}
            >
              Active Users
              <span style={modernStyles.tabCount}>
                {filteredActiveUsers.length}
              </span>
            </button>
            <button
              style={{
                ...modernStyles.tabButton,
                ...(activeTab === "revoked" ? modernStyles.activeTab : {}),
              }}
              onClick={() => setActiveTab("revoked")}
            >
              Revoked Users
              <span style={modernStyles.tabCount}>
                {filteredRevokedUsers.length}
              </span>
            </button>
          </div>

          {/* Active Users Table */}
          {activeTab === "active" && (
            <div style={modernStyles.tableContainer}>
              {filteredActiveUsers.length > 0 ? (
                <table className="table table-hover">
                  <thead style={modernStyles.tableHeader}>
                    <tr>
                      <th style={modernStyles.tableHeaderCell}>Name</th>
                      <th style={modernStyles.tableHeaderCell}>Email</th>
                      <th style={modernStyles.tableHeaderCell}>Department</th>
                      <th style={modernStyles.tableHeaderCell}>Position</th>
                      <th style={modernStyles.tableHeaderCell}>Status</th>
                      <th style={modernStyles.tableHeaderCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActiveUsers.map((record) => (
                      <tr key={record._id} style={modernStyles.tableRow}>
                        <td style={modernStyles.tableCell}>{record.name}</td>
                        <td style={modernStyles.tableCell}>{record.email}</td>
                        <td style={modernStyles.tableCell}>
                          {record.department}
                        </td>
                        <td style={modernStyles.tableCell}>
                          {record.position}
                        </td>
                        <td style={modernStyles.tableCell}>
                          <span
                            style={{
                              ...modernStyles.statusBadge,
                              backgroundColor:
                                record.status === "1"
                                  ? "#2ecc71"
                                  : record.status === "2"
                                  ? "#f1c40f"
                                  : "#e74c3c",
                            }}
                          >
                            {record.status === "1"
                              ? "Active"
                              : record.status === "2"
                              ? "On Leave"
                              : "Inactive"}
                          </span>
                        </td>
                        <td style={modernStyles.tableCell}>
                          <div style={modernStyles.actionButtons}>
                            <button
                              className="btn btn-sm"
                              style={modernStyles.editButton}
                              onClick={() =>
                                navigate(
                                  `/HRDashboard/AccessUpdate/${record._id}`
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm"
                              style={modernStyles.revokeButton}
                              onClick={() => revokeAccess(record._id)}
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={modernStyles.emptyMessage}>
                  <div style={modernStyles.emptyIcon}>
                    <Users size={48} color="#ccc" />
                  </div>
                  <p>No active users match your search criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Revoked Users Table */}
          {activeTab === "revoked" && (
            <div style={modernStyles.tableContainer}>
              {filteredRevokedUsers.length > 0 ? (
                <table className="table table-hover">
                  <thead style={modernStyles.tableHeader}>
                    <tr>
                      <th style={modernStyles.tableHeaderCell}>Name</th>
                      <th style={modernStyles.tableHeaderCell}>Email</th>
                      <th style={modernStyles.tableHeaderCell}>Department</th>
                      <th style={modernStyles.tableHeaderCell}>Position</th>
                      <th style={modernStyles.tableHeaderCell}>Status</th>
                      <th style={modernStyles.tableHeaderCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRevokedUsers.map((record) => (
                      <tr key={record._id} style={modernStyles.revokedRow}>
                        <td style={modernStyles.tableCell}>{record.name}</td>
                        <td style={modernStyles.tableCell}>{record.email}</td>
                        <td style={modernStyles.tableCell}>
                          {record.department}
                        </td>
                        <td style={modernStyles.tableCell}>
                          {record.position}
                        </td>
                        <td style={modernStyles.tableCell}>
                          <span style={modernStyles.revokedBadge}>
                            Access Revoked
                          </span>
                        </td>
                        <td style={modernStyles.tableCell}>
                          <div style={modernStyles.actionButtons}>
                            <button
                              className="btn btn-sm"
                              style={modernStyles.restoreButton}
                              onClick={() => restoreAccess(record._id)}
                            >
                              Restore
                            </button>
                            <button
                              className="btn btn-sm"
                              style={modernStyles.deleteButton}
                              onClick={() => deleteAccess(record._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={modernStyles.emptyMessage}>
                  <div style={modernStyles.emptyIcon}>
                    <Users size={48} color="#ccc" />
                  </div>
                  <p>No revoked users match your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const modernStyles = {
  // Main Layout
  mainContent: {
    width: "calc(100vw - 250px)",
    marginTop: "70px",
    marginLeft: "250px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#f8f9fa",
    maxWidth: "calc(100vw - 250px)",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  },
  contentWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },

  // Page Header
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2c3e50",
    margin: 0,
  },

  // Section Styling
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  dashboardSection: {
    marginBottom: "30px",
  },
  accessSection: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: "30px",
  },

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    },
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  statIconContainer: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "#fc6625",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },
  statTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  statContent: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  statItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
    color: "#555",
  },
  statValue: {
    fontWeight: "600",
    color: "#2c3e50",
  },
  statHighlight: {
    fontWeight: "700",
    color: "#fc6625",
    fontSize: "16px",
  },
  statBarContainer: {
    display: "flex",
    alignItems: "center",
    width: "120px",
  },
  statBar: {
    height: "8px",
    borderRadius: "4px",
    marginRight: "8px",
  },
  statusBadgeContainer: {
    display: "flex",
    alignItems: "center",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    minWidth: "60px",
    textAlign: "center",
  },

  // Chart Container
  chartContainer: {
    height: "220px",
    position: "relative",
    marginTop: "10px",
  },
  chartLoading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: "#7f8c8d",
  },

  // Search and Filter
  searchContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchInputWrapper: {
    position: "relative",
    flex: "1",
    minWidth: "250px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#95a5a6",
  },
  searchInput: {
    paddingLeft: "45px",
    height: "48px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    boxShadow: "none",
    fontSize: "14px",
    "&:focus": {
      borderColor: "#fc6625",
      boxShadow: "0 0 0 3px rgba(252, 102, 37, 0.1)",
    },
  },
  filterSelect: {
    minWidth: "200px",
  },
  selectInput: {
    height: "48px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    boxShadow: "none",
    fontSize: "14px",
    "&:focus": {
      borderColor: "#fc6625",
      boxShadow: "0 0 0 3px rgba(252, 102, 37, 0.1)",
    },
  },

  // Tabs
  tabsContainer: {
    display: "flex",
    marginBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  tabButton: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    color: "#7f8c8d",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#2c3e50",
    },
  },
  activeTab: {
    color: "#fc6625",
    borderBottomColor: "#fc6625",
  },
  tabCount: {
    marginLeft: "8px",
    backgroundColor: "#f0f0f0",
    color: "#7f8c8d",
    borderRadius: "20px",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "600",
  },

  // Table Styling
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  tableHeaderCell: {
    padding: "15px",
    fontWeight: "600",
    color: "#2c3e50",
    borderBottom: "2px solid #e0e0e0",
    fontSize: "14px",
  },
  tableRow: {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  tableCell: {
    padding: "15px",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#555",
    borderBottom: "1px solid #f0f0f0",
  },
  revokedRow: {
    backgroundColor: "#fff9f8",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#fff0ee",
    },
  },
  revokedBadge: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    display: "inline-block",
  },

  // Action Buttons
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    backgroundColor: "#3498db",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#2980b9",
    },
  },
  revokeButton: {
    backgroundColor: "#f39c12",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#d68910",
    },
  },
  restoreButton: {
    backgroundColor: "#27ae60",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#219a52",
    },
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#c0392b",
    },
  },

  // Export Button
  pdfControls: {
    position: "relative",
  },
  exportButton: {
    backgroundColor: "#fc6625",
    borderColor: "#fc6625",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#e55b1e",
    },
  },
  dropdownMenu: {
    padding: "8px 0",
    borderRadius: "8px",
    border: "none",
  },

  // Empty States
  emptyMessage: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#7f8c8d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    marginBottom: "15px",
  },

  // Loading
  loadingContainer: {
    marginLeft: "250px",
    marginTop: "60px",
    height: "calc(100vh - 60px)",
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    width: "300px",
  },
  loadingTitle: {
    color: "#2c3e50",
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "600",
  },
  spinner: {
    color: "#fc6625",
    width: "40px",
    height: "40px",
  },
  loadingText: {
    marginTop: "20px",
    color: "#7f8c8d",
    fontSize: "14px",
  },

  // Alert
  alertBox: {
    marginBottom: "20px",
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  retryButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: "500",
  },
};
