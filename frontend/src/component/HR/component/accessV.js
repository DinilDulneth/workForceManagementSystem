"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, FileText } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
// Import the logo directly
import companyLogoImg from "../../../public/logo1.png";

export default function AccessView() {
  const navigate = useNavigate()
  const [accessRecords, setAccessRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("name") // Default filter by name
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    getAccessRecords()

    // Initialize Bootstrap dropdowns
    if (typeof document !== "undefined") {
      const bootstrap = require("bootstrap")
      const dropdownElementList = [].slice.call(document.querySelectorAll(".dropdown-toggle"))
      dropdownElementList.map((dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl))
    }
  }, [])

  function getAccessRecords() {
    setLoading(true)
    setError(null)

    axios
      .get(`http://localhost:8070/access/getAccess`, { timeout: 5000 })
      .then((res) => {
        setAccessRecords(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching access records:", err)
        setError("Could not connect to the server. Please try again later.")
        setLoading(false)
      })
  }

  function deleteAccess(id) {
    if (window.confirm("Are you sure you want to delete this access record?")) {
      axios
        .delete(`http://localhost:8070/access/deleteAccess/${id}`)
        .then(() => {
          alert("Access record deleted successfully")
          setAccessRecords(accessRecords.filter((record) => record._id !== id))
        })
        .catch((err) => {
          alert("Error deleting record: " + err.message)
        })
    }
  }

  function revokeAccess(id) {
    if (window.confirm("Are you sure you want to revoke this user's access?")) {
      axios
        .patch(`http://localhost:8070/access/revokeAccess/${id}`)
        .then(() => {
          alert("Access revoked successfully")
          getAccessRecords() // Refresh the records
        })
        .catch((err) => {
          alert("Error revoking access: " + err.message)
        })
    }
  }

  function restoreAccess(id) {
    if (window.confirm("Are you sure you want to restore this user's access?")) {
      axios
        .patch(`http://localhost:8070/access/updateAccess/${id}`, {
          access: "1",
          status: "1",
        })
        .then(() => {
          alert("Access restored successfully")
          getAccessRecords()
        })
        .catch((err) => {
          alert("Error restoring access: " + err.message)
        })
    }
  }

  const handleRetry = () => {
    getAccessRecords()
  }

  // Filter records based on search term and filter criteria
  const filterRecords = (records) => {
    if (!searchTerm) return records

    return records.filter((record) => {
      const value = record[filterBy]?.toString().toLowerCase() || ""
      return value.includes(searchTerm.toLowerCase())
    })
  }

  // Get filtered active and revoked users
  const filteredActiveUsers = filterRecords(accessRecords.filter((record) => record.access !== "99"))
  const filteredRevokedUsers = filterRecords(accessRecords.filter((record) => record.access === "99"))

  // Function to generate PDF
  const generatePDF = (recordType = "all") => {
    setIsGeneratingPDF(true)

    try {
      // Create a new PDF document
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add company logo
      try {
        const imgWidth = 40
        const imgHeight = 20
        const xPos = (pageWidth - imgWidth) / 2 // Center the logo
        doc.addImage(companyLogoImg, "PNG", xPos, 10, imgWidth, imgHeight)
      } catch (imgError) {
        console.error("Error adding image to PDF:", imgError)
        // Fallback to text
        doc.setFontSize(20)
        doc.setTextColor(252, 102, 37) // #fc6625
        doc.text("WorkSync", pageWidth / 2, 20, { align: "center" })
      }

      // Add title
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80) // #2c3e50
      doc.text("Access Management Report", pageWidth / 2, 40, { align: "center" })

      // Add date
      const today = new Date()
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, pageWidth / 2, 48, {
        align: "center",
      })

      // Add summary
      doc.setFontSize(12)
      doc.setTextColor(44, 62, 80)
      doc.text(`Total Users: ${accessRecords.length}`, 14, 60)
      doc.text(`Active Users: ${accessRecords.filter((r) => r.access !== "99" && r.status === "1").length}`, 14, 68)
      doc.text(`Revoked Users: ${accessRecords.filter((r) => r.access === "99").length}`, 14, 76)

      // Determine which records to include
      let recordsToInclude = []
      if (recordType === "active" || recordType === "all") {
        recordsToInclude = [...filteredActiveUsers]
      }

      if (recordType === "revoked" || recordType === "all") {
        recordsToInclude = [...recordsToInclude, ...filteredRevokedUsers]
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
      ])

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
      })

      // Add search filter info if applied
      if (searchTerm) {
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 85
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Filtered by: ${filterBy} containing "${searchTerm}"`, 14, finalY + 10)
      }

      // Save the PDF
      const fileName = `access_report_${recordType}_${today.toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Manual dropdown toggle function (in case Bootstrap JS isn't working)
  const toggleDropdown = () => {
    const dropdown = document.getElementById("exportDropdownMenu")
    if (dropdown) {
      dropdown.classList.toggle("show")
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Access Records</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>Loading access records...</p>
      </div>
    )
  }

  return (
    <div style={styles.mainContent}>
      <div style={styles.contentWrapper}>
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h4>Total Users</h4>
            <p style={styles.cardNumber}>{accessRecords.length}</p>
          </div>
          <div style={styles.card}>
            <h4>Active Users</h4>
            <p style={styles.cardNumber}>
              {accessRecords.filter((record) => record.access !== "99" && record.status === "1").length}
            </p>
          </div>
          <div style={styles.card}>
            <h4>Revoked Users</h4>
            <p style={styles.cardNumber}>{accessRecords.filter((record) => record.access === "99").length}</p>
          </div>
        </div>

        <div style={styles.headerContainer}>
          <h2 style={styles.header}>Access Management</h2>

          {/* PDF Export Options - Simplified Dropdown */}
          <div style={styles.pdfControls}>
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="exportDropdown"
                onClick={toggleDropdown}
                disabled={isGeneratingPDF}
                style={styles.exportButton}
              >
                <FileText size={16} style={{ marginRight: "6px" }} />
                Export PDF
              </button>
              <ul className="dropdown-menu" id="exportDropdownMenu" aria-labelledby="exportDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => generatePDF("all")} disabled={isGeneratingPDF}>
                    All Users
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => generatePDF("active")} disabled={isGeneratingPDF}>
                    Active Users Only
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => generatePDF("revoked")} disabled={isGeneratingPDF}>
                    Revoked Users Only
                  </button>
                </li>
              </ul>
            </div>

            {isGeneratingPDF && (
              <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                <span className="visually-hidden">Generating PDF...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={styles.alertBox} className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Note:</strong> {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <div className="mt-2">
              <button className="btn btn-sm btn-primary" onClick={handleRetry} style={styles.button}>
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Section - Centered */}
        <div style={styles.searchContainerCentered}>
          <div style={styles.searchRow}>
            <div style={styles.searchInputWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="form-control"
              />
            </div>
            <div style={styles.filterSelect}>
              <span style={styles.filterLabel}>Filter by:</span>
              <select
                id="filterBy"
                className="form-select"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={styles.selectInput}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="department">Department</option>
                <option value="position">Position</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Users Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.subHeader}>
            Active Users
            <span style={styles.resultCount}>
              {filteredActiveUsers.length} {filteredActiveUsers.length === 1 ? "result" : "results"}
            </span>
          </h3>
          {filteredActiveUsers.length > 0 ? (
            <table className="table table-hover mb-0">
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Department</th>
                  <th style={styles.tableHeaderCell}>Position</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActiveUsers.map((record) => (
                  <tr key={record._id}>
                    <td style={styles.tableCell}>{record.name}</td>
                    <td style={styles.tableCell}>{record.email}</td>
                    <td style={styles.tableCell}>{record.department}</td>
                    <td style={styles.tableCell}>{record.position}</td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor:
                            record.status === "1" ? "#2ecc71" : record.status === "2" ? "#f1c40f" : "#e74c3c",
                        }}
                      >
                        {record.status === "1" ? "Active" : record.status === "2" ? "On Leave" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() => navigate(`/HRDashboard/AccessUpdate/${record._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.revokeButton }}
                        onClick={() => revokeAccess(record._id)}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyMessage}>No active users match your search criteria.</div>
          )}
        </div>

        {/* Revoked Users Table */}
        <h3 style={styles.subHeader}>
          Revoked Users
          <span style={styles.resultCount}>
            {filteredRevokedUsers.length} {filteredRevokedUsers.length === 1 ? "result" : "results"}
          </span>
        </h3>
        <div style={styles.tableContainer}>
          {filteredRevokedUsers.length > 0 ? (
            <table className="table table-hover mb-0">
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Department</th>
                  <th style={styles.tableHeaderCell}>Position</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevokedUsers.map((record) => (
                  <tr key={record._id} style={styles.revokedRow}>
                    <td style={styles.tableCell}>{record.name}</td>
                    <td style={styles.tableCell}>{record.email}</td>
                    <td style={styles.tableCell}>{record.department}</td>
                    <td style={styles.tableCell}>{record.position}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.revokedBadge}>Access Revoked</span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.restoreButton }}
                        onClick={() => restoreAccess(record._id)}
                      >
                        Restore Access
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => deleteAccess(record._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyMessage}>No revoked users match your search criteria.</div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "60px",
    padding: "20px",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f8f9fa",
    transition: "all 0.3s ease",
  },
  contentWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "3px solid #fc6625",
  },
  header: {
    color: "#2c3e50",
    margin: 0,
  },
  pdfControls: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  exportButton: {
    backgroundColor: "#2c3e50",
    borderColor: "#2c3e50",
    display: "flex",
    alignItems: "center",
  },
  subHeader: {
    color: "#2c3e50",
    marginBottom: "15px",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
  },
  resultCount: {
    fontSize: "0.9rem",
    color: "#7f8c8d",
    marginLeft: "10px",
    fontWeight: "normal",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: "20px",
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
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: "500",
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
    "&:hover": {
      backgroundColor: "#2980b9",
    },
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    "&:hover": {
      backgroundColor: "#c0392b",
    },
  },
  revokeButton: {
    backgroundColor: "#f39c12",
    border: "none",
    color: "white",
    "&:hover": {
      backgroundColor: "#d68910",
    },
  },
  restoreButton: {
    backgroundColor: "#27ae60",
    border: "none",
    color: "white",
    "&:hover": {
      backgroundColor: "#219a52",
    },
  },
  revokedRow: {
    backgroundColor: "#fff3e0",
  },
  revokedBadge: {
    backgroundColor: "#f39c12",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  alertBox: {
    marginBottom: "20px",
    borderRadius: "8px",
  },
  loadingContainer: {
    marginLeft: "250px",
    marginTop: "60px",
    height: "calc(100vh - 60px)",
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
  searchContainerCentered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    width: "100%",
  },
  searchRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "10px",
  },
  searchInputWrapper: {
    position: "relative",
    flex: "1",
    minWidth: "250px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#95a5a6",
  },
  searchInput: {
    paddingLeft: "40px",
    height: "45px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  filterSelect: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    margin: "0",
    color: "#2c3e50",
    fontWeight: "500",
  },
  selectInput: {
    minWidth: "150px",
    height: "45px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
}
