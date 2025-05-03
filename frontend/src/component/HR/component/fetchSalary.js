import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaFilter, FaFilePdf, FaUserPlus } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

export default function AccessV() {
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "revoked"
  const [filterRole, setFilterRole] = useState("all"); // "all", "employee", "manager", "hr"
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAccessData();
  }, []);

  const fetchAccessData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8070/access/getAccess"
      );
      setAccessData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching access data:", err);
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fc6625",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8070/access/deleteAccess/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "User access has been revoked.", "success");
            // Update the state to remove the deleted item
            setAccessData(accessData.filter((item) => item._id !== id));
          })
          .catch((err) => {
            console.error("Error deleting access:", err);
            Swal.fire("Error", "Failed to delete access.", "error");
          });
      }
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Email",
      "Department",
      "Position",
      "Role",
      "Status",
    ];
    const tableRows = [];

    // Apply filters to the data for PDF
    const filteredData = getFilteredAccessData();

    // Add data to rows
    filteredData.forEach((user) => {
      const userData = [
        user.name,
        user.email,
        user.department || "-",
        user.position || "-",
        getRoleLabel(user.status),
        user.access === "1" ? "Active" : "Revoked",
      ];
      tableRows.push(userData);
    });

    // Add title to PDF
    doc.setFontSize(20);
    doc.text("User Access Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

    // Add filter information
    doc.setFontSize(9);
    doc.text(
      `Status Filter: ${
        filterStatus === "all"
          ? "All"
          : filterStatus === "active"
          ? "Active"
          : "Revoked"
      }`,
      14,
      27
    );
    doc.text(
      `Role Filter: ${
        filterRole === "all" ? "All Roles" : getRoleLabel(filterRole)
      }`,
      14,
      32
    );
    if (searchTerm) {
      doc.text(`Search: "${searchTerm}"`, 14, 37);
    }

    // Create the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: searchTerm ? 40 : 35,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [252, 102, 37] },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} - WorkSync Access Management`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`access_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Get role label from status code
  const getRoleLabel = (status) => {
    switch (status) {
      case "1":
        return "Employee";
      case "2":
        return "Manager";
      case "3":
        return "HR";
      default:
        return "Unknown";
    }
  };

  // Apply filters and search to the data
  const getFilteredAccessData = () => {
    return accessData
      .filter((user) => {
        // Apply status filter
        if (filterStatus === "active") {
          return user.access === "1";
        } else if (filterStatus === "revoked") {
          return user.access === "99";
        }
        return true; // "all" filter
      })
      .filter((user) => {
        // Apply role filter
        if (filterRole !== "all") {
          return user.status === filterRole;
        }
        return true;
      })
      .filter((user) => {
        // Apply search
        const searchLower = searchTerm.toLowerCase();
        return (
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.department &&
            user.department.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;

        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "email") {
          comparison = a.email.localeCompare(b.email);
        } else if (sortBy === "department") {
          comparison = (a.department || "").localeCompare(b.department || "");
        } else if (sortBy === "status") {
          comparison = a.status.localeCompare(b.status);
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  };

  const filteredAccessData = getFilteredAccessData();

  // Count users by role
  const employeeCount = accessData.filter((user) => user.status === "1").length;
  const managerCount = accessData.filter((user) => user.status === "2").length;
  const hrCount = accessData.filter((user) => user.status === "3").length;
  const activeCount = accessData.filter((user) => user.access === "1").length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>
          User Access Data
        </h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Loading access data...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <div style={styles.gridContainer}>
        {/* Summary Cards */}
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h4>Total Users</h4>
            <p style={styles.cardNumber}>{accessData.length}</p>
          </div>
          <div style={styles.card}>
            <h4>Active Users</h4>
            <p style={styles.cardNumber}>{activeCount}</p>
          </div>
          <div style={styles.card}>
            <h4>Employees</h4>
            <p style={styles.cardNumber}>{employeeCount}</p>
          </div>
          <div style={styles.card}>
            <h4>Managers</h4>
            <p style={styles.cardNumber}>{managerCount}</p>
          </div>
        </div>

        {/* Header and actions row */}
        <div style={styles.headerRow}>
          <h2 style={styles.header}>Salary Management</h2>

          <div style={styles.actionsContainer}>
            {/* <button 
              className="btn" 
              style={styles.addButton}
              onClick={() => navigate("/HRDashboard/accessF")}
              title="Grant new access"
            >
              <FaUserPlus /> New Access
            </button> */}
            <button
              className="btn"
              style={styles.pdfButton}
              onClick={generatePDF}
              title="Generate PDF report"
            >
              <FaFilePdf /> Export PDF
            </button>
          </div>
        </div>

        {error && (
          <div
            style={styles.alertBox}
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
                className="btn btn-sm btn-primary"
                onClick={fetchAccessData}
                style={styles.retryButton}
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Filter and search bar */}
        <div style={styles.filterSearchContainer}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterContainer}>
            <FaFilter style={styles.filterIcon} />
            <select
              value={filterStatus}
              onChange={handleStatusFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Users</option>
              <option value="revoked">Revoked Access</option>
            </select>
          </div>

          <div style={styles.filterContainer}>
            <FaFilter style={styles.filterIcon} />
            <select
              value={filterRole}
              onChange={handleRoleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Roles</option>
              <option value="1">Employees</option>
              <option value="2">Managers</option>
              <option value="3">HR Staff</option>
            </select>
          </div>
        </div>

        {/* Results information */}
        <div style={styles.resultsInfo}>
          Showing {filteredAccessData.length} of {accessData.length} users
        </div>

        <div style={styles.tableContainer}>
          <table className="table table-hover mb-0">
            <thead style={styles.tableHeader}>
              <tr>
                <th
                  style={{ ...styles.tableHeaderCell, cursor: "pointer" }}
                  onClick={() => handleSortChange("name")}
                >
                  Name
                  {sortBy === "name" && (
                    <span style={styles.sortArrow}>
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{ ...styles.tableHeaderCell, cursor: "pointer" }}
                  onClick={() => handleSortChange("email")}
                >
                  Email
                  {sortBy === "email" && (
                    <span style={styles.sortArrow}>
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{ ...styles.tableHeaderCell, cursor: "pointer" }}
                  onClick={() => handleSortChange("department")}
                >
                  Department
                  {sortBy === "department" && (
                    <span style={styles.sortArrow}>
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th style={styles.tableHeaderCell}>Position</th>
                <th
                  style={{ ...styles.tableHeaderCell, cursor: "pointer" }}
                  onClick={() => handleSortChange("status")}
                >
                  Role
                  {sortBy === "status" && (
                    <span style={styles.sortArrow}>
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccessData.length > 0 ? (
                filteredAccessData.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.tableCell}>{user.name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.department || "-"}</td>
                    <td style={styles.tableCell}>{user.position || "-"}</td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          backgroundColor:
                            user.status === "3"
                              ? "#ff9800"
                              : user.status === "2"
                              ? "#2196f3"
                              : "#4caf50",
                        }}
                      >
                        {getRoleLabel(user.status)}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor:
                            user.access === "1" ? "#4caf50" : "#f44336",
                        }}
                      >
                        {user.access === "1" ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() =>
                          navigate(`/HRDashboard/updateAccess/${user._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => handleDelete(user._id)}
                      >
                        {user.access === "1" ? "Revoke" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.emptyMessage}>
                    {accessData.length > 0
                      ? "No matching access records found."
                      : "No access records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
    flexDirection: "column",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fc6625",
    marginTop: "10px",
  },
  header: {
    color: "#2c3e50",
    marginBottom: "0",
    paddingBottom: "0",
    fontSize: "1.75rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "3px solid #fc6625",
    paddingBottom: "15px",
    marginBottom: "10px",
  },
  actionsContainer: {
    display: "flex",
    gap: "10px",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#2c3e50",
    color: "white",
  },
  tableHeaderCell: {
    padding: "15px",
    fontWeight: "500",
  },
  tableCell: {
    padding: "12px 15px",
    verticalAlign: "middle",
  },
  button: {
    transition: "all 0.3s ease",
    margin: "0 5px",
    padding: "5px 15px",
  },
  editButton: {
    backgroundColor: "#3498db",
    border: "none",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
  },
  retryButton: {
    backgroundColor: "#fc6625",
    border: "none",
    color: "white",
  },
  alertBox: {
    marginBottom: "20px",
    borderRadius: "8px",
  },
  loadingContainer: {
    marginLeft: "250px",
    marginTop: "70px",
    height: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
  },
  filterSearchContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  searchContainer: {
    position: "relative",
    flex: "1",
    minWidth: "250px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 15px 10px 40px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "14px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d",
  },
  filterContainer: {
    position: "relative",
    width: "200px",
  },
  filterSelect: {
    width: "100%",
    padding: "10px 15px 10px 40px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "14px",
    appearance: "none",
    backgroundColor: "white",
  },
  filterIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d",
    pointerEvents: "none",
  },
  resultsInfo: {
    fontSize: "14px",
    color: "#6c757d",
    marginBottom: "10px",
  },
  pdfButton: {
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
  },
  addButton: {
    backgroundColor: "#fc6625",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
  },
  roleBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },
  statusBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
  },
  sortArrow: {
    display: "inline-block",
    marginLeft: "5px",
  },
};
