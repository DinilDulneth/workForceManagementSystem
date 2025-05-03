import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { FaSearch, FaFilter, FaFilePdf, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function FetchResignations() {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "processed"
  const [sortBy, setSortBy] = useState("endDate"); // Default sort by end date
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    getResignations();
  }, []);

  function getResignations() {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8070/resignation/getempRes`, { timeout: 5000 })
      .then((res) => {
        setResignations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resignations:", err);
        setError("Could not connect to the server. Please try again later.");
        setLoading(false);
      });
  }

  // Delete Resignation by ID
  function deleteResignation(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
          .then(() => {
            Swal.fire(
              "Deleted!",
              "Resignation has been deleted.",
              "success"
            );
            setResignations(
              resignations.filter((resignation) => resignation._id !== id)
            ); // Update UI
          })
          .catch((err) => {
            Swal.fire("Error", err.message, "error");
          });
      }
    });
  }

  // Function to retry API call
  const handleRetry = () => {
    getResignations();
  };

  // PDF Generation function
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Employee ID", "Reason", "End Date", "Status"];
    const tableRows = [];

    // Apply filters to the data for PDF
    const filteredData = getFilteredResignations();

    // Add data to rows
    filteredData.forEach(resignation => {
      const resignationData = [
        resignation.empId,
        resignation.Reason.length > 30 ? resignation.Reason.substring(0, 30) + "..." : resignation.Reason,
        new Date(resignation.endDate).toLocaleDateString(),
        new Date(resignation.endDate) > new Date() ? "Active" : "Processed"
      ];
      tableRows.push(resignationData);
    });

    // Add title to PDF
    doc.setFontSize(20);
    doc.text("Resignation Records", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Add filter information
    doc.setFontSize(9);
    doc.text(`Filter: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Resignations`, 14, 27);
    if (searchTerm) {
      doc.text(`Search: "${searchTerm}"`, 14, 32);
    }

    // Create the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: searchTerm ? 35 : 30,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80] }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} - WorkSync HR System`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`resignations_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Apply filters and search to the data
  const getFilteredResignations = () => {
    return resignations
      .filter(resignation => {
        // Apply status filter
        if (filterStatus === "active") {
          return new Date(resignation.endDate) > new Date();
        } else if (filterStatus === "processed") {
          return new Date(resignation.endDate) <= new Date();
        }
        return true; // "all" filter
      })
      .filter(resignation => {
        // Apply search
        const searchLower = searchTerm.toLowerCase();
        return (
          resignation.empId.toLowerCase().includes(searchLower) ||
          resignation.Reason.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;
        
        if (sortBy === "empId") {
          comparison = a.empId.localeCompare(b.empId);
        } else if (sortBy === "endDate") {
          comparison = new Date(a.endDate) - new Date(b.endDate);
        } else if (sortBy === "Reason") {
          comparison = a.Reason.localeCompare(b.Reason);
        }
        
        return sortOrder === "asc" ? comparison : -comparison;
      });
  };

  const filteredResignations = getFilteredResignations();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>
          Resignations Data
        </h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Loading resignation data...
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
            <h4>Total Resignations</h4>
            <p style={styles.cardNumber}>{resignations.length}</p>
          </div>
          <div style={styles.card}>
            <h4>Active Requests</h4>
            <p style={styles.cardNumber}>
              {
                resignations.filter((r) => new Date(r.endDate) > new Date())
                  .length
              }
            </p>
          </div>
          <div style={styles.card}>
            <h4>Processed</h4>
            <p style={styles.cardNumber}>
              {
                resignations.filter((r) => new Date(r.endDate) <= new Date())
                  .length
              }
            </p>
          </div>
        </div>

        {/* Header and actions row */}
        <div style={styles.headerRow}>
          <h2 style={styles.header}>Resignation Records</h2>
          
          <div style={styles.actionsContainer}>
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
                onClick={handleRetry}
                style={styles.button}
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
              placeholder="Search by Employee ID or Reason..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterContainer}>
            <FaFilter style={styles.filterIcon} />
            <select 
              value={filterStatus}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Resignations</option>
              <option value="active">Active Requests</option>
              <option value="processed">Processed Requests</option>
            </select>
          </div>
        </div>

        {/* Results information */}
        <div style={styles.resultsInfo}>
          Showing {filteredResignations.length} of {resignations.length} resignations
        </div>

        <div style={styles.tableContainer}>
          <table className="table table-hover mb-0">
            <thead style={styles.tableHeader}>
              <tr>
                <th 
                  style={{...styles.tableHeaderCell, cursor: 'pointer'}}
                  onClick={() => handleSortChange('empId')}
                >
                  Employee ID
                  {sortBy === 'empId' && (
                    <span style={styles.sortArrow}>
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th 
                  style={{...styles.tableHeaderCell, cursor: 'pointer'}}
                  onClick={() => handleSortChange('Reason')}
                >
                  Reason
                  {sortBy === 'Reason' && (
                    <span style={styles.sortArrow}>
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th 
                  style={{...styles.tableHeaderCell, cursor: 'pointer'}}
                  onClick={() => handleSortChange('endDate')}
                >
                  End Date
                  {sortBy === 'endDate' && (
                    <span style={styles.sortArrow}>
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResignations.length > 0 ? (
                filteredResignations.map((resignation) => (
                  <tr key={resignation._id}>
                    <td style={styles.tableCell}>{resignation.empId}</td>
                    <td style={styles.tableCell}>{resignation.Reason}</td>
                    <td style={styles.tableCell}>
                      {new Date(resignation.endDate).toLocaleDateString()}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: new Date(resignation.endDate) > new Date() ? "#2ecc71" : "#95a5a6"
                      }}>
                        {new Date(resignation.endDate) > new Date() ? "Active" : "Processed"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() =>
                          navigate(
                            `/HRDashboard/ResignationUemp/${resignation.empId}`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => deleteResignation(resignation._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyMessage}>
                    {resignations.length > 0 ? 
                      "No matching resignation records found." : 
                      "No resignation records found."}
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
  // Existing styles
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
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%"
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fc6625",
    marginTop: "10px"
  },
  header: {
    color: "#2c3e50",
    marginBottom: "0",
    paddingBottom: "0",
    fontSize: "1.75rem"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "3px solid #fc6625",
    paddingBottom: "15px",
    marginBottom: "10px"
  },
  actionsContainer: {
    display: "flex",
    gap: "10px"
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  },
  tableHeader: {
    backgroundColor: "#2c3e50",
    color: "white"
  },
  tableHeaderCell: {
    padding: "15px",
    fontWeight: "500"
  },
  tableCell: {
    padding: "12px 15px",
    verticalAlign: "middle"
  },
  button: {
    transition: "all 0.3s ease",
    margin: "0 5px",
    padding: "5px 15px"
  },
  editButton: {
    backgroundColor: "#3498db",
    border: "none",
    color: "white"
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white"
  },
  alertBox: {
    marginBottom: "20px",
    borderRadius: "8px"
  },
  loadingContainer: {
    marginLeft: "250px",
    marginTop: "70px",
    height: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  emptyMessage: {
    textAlign: "center",
    padding: "20px",
    color: "#666"
  },
  
  // New styles for search, filter, and PDF
  filterSearchContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px"
  },
  searchContainer: {
    position: "relative",
    flex: "1"
  },
  searchInput: {
    width: "100%",
    padding: "10px 15px 10px 40px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "14px"
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d"
  },
  filterContainer: {
    position: "relative",
    width: "220px"
  },
  filterSelect: {
    width: "100%",
    padding: "10px 15px 10px 40px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "14px",
    appearance: "none",
    backgroundColor: "white"
  },
  filterIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d",
    pointerEvents: "none"
  },
  resultsInfo: {
    fontSize: "14px",
    color: "#6c757d",
    marginBottom: "10px"
  },
  pdfButton: {
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px"
  },
  statusBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500"
  },
  sortArrow: {
    display: "inline-block",
    marginLeft: "5px"
  }
};