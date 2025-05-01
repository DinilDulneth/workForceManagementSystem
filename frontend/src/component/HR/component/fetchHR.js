import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faFilePdf, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

export default function FetchHR() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  useEffect(() => {
    getHR();
  }, []);

  function getHR() {
    setLoading(true);
    setError(null);

    const fetchPromise = axios.get("http://localhost:8070/hr/getHR", {
      timeout: 5000,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching HR employees:", err);
        setError("Could not connect to the server. Please try again.");
        setLoading(false);
      });
  }

  const handleRetry = () => {
    getHR();
  };

  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    switch (searchField) {
      case "name":
        return employee.name?.toLowerCase().includes(term);
      case "email":
        return employee.email?.toLowerCase().includes(term);
      case "position":
        return employee.position?.toLowerCase().includes(term);
      case "department":
        return employee.department?.toLowerCase().includes(term);
      case "all":
      default:
        return Object.values(employee).some((value) =>
          String(value).toLowerCase().includes(term)
        );
    }
  });

  const downloadHRAsPDF = () => {
    try {
      toast.info("Preparing HR list PDF...", {
        position: "top-right",
        autoClose: 2000
      });

      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("HR Officers List Report", 14, 15);

      // Add date
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

      const tableColumn = [
        "Name",
        "Position",
        "Department",
        "Email",
        "Phone",
        "Salary",
        "Join Date",
        "Status"
      ];

      const tableRows = filteredEmployees.map(hr => [
        hr.name || "N/A",
        hr.position || "N/A",
        hr.department || "N/A",
        hr.email || "N/A",
        hr.phone || "N/A",
        hr.salary ? `$${hr.salary.toLocaleString()}` : "N/A",
        hr.dateOfJoining ? new Date(hr.dateOfJoining).toLocaleDateString() : "N/A",
        hr.availability === "1" || hr.availability === 1 ? "Active" : "Inactive"
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [255, 112, 67],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 40 },
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 }
        },
        margin: { top: 35 }
      });

      doc.save(`HR_Officers_${new Date().toISOString().split('T')[0]}.pdf`);

      toast.success("PDF downloaded successfully!", {
        position: "top-right",
        autoClose: 2000
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error("Failed to generate PDF. Please try again.", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this HR employee?')) {
      axios.delete(`http://localhost:8070/hr/deleteHR/${id}`)
        .then(() => {
          toast.success(' HR Employee deleted successfully');
          getHR(); // Refresh the list
        })
        .catch(err => {
          console.error('Delete error:', err);
          toast.error('Failed to delete HR employee');
        });
    }
  };

  const handleStatusChange = (id, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    
    if (window.confirm('Are you sure you want to change this HR officer\'s status?')) {
      axios.patch(`http://localhost:8070/hr/updateActiveStatus/${id}`, {
        availability: newStatus === 'active' ? "1" : "0"
      })
        .then(() => {
          toast.success('HR officer status updated successfully');
          getHR(); // Refresh the list
        })
        .catch(err => {
          console.error('Status update error:', err);
          toast.error('Failed to update HR officer status');
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/HRDashboard/updateHR/${id}`);
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <p style={styles.title}>HR Employees Data</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={styles.loadingText}>Loading HR employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>HR Officers Data</h2>

        <div style={styles.searchContainer}>
          <div style={styles.searchControls}>
            <button
              style={{
                ...styles.advancedSearchButton,
                backgroundColor: advancedSearch ? "#ff7043" : "#fff",
                color: advancedSearch ? "#fff" : "#666"
              }}
              onClick={() => setAdvancedSearch(!advancedSearch)}
            >
              <FontAwesomeIcon icon={faFilter} style={styles.filterIcon} />
              Filter
            </button>

            <div style={styles.searchWrapper}>
              <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
              <input
                type="text"
                placeholder={`Search ${searchField === "all" ? "HR officers" : searchField}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button
              onClick={downloadHRAsPDF}
              style={{
                ...styles.pdfButton,
                opacity: filteredEmployees.length === 0 ? 0.7 : 1,
                cursor: filteredEmployees.length === 0 ? 'not-allowed' : 'pointer'
              }}
              disabled={filteredEmployees.length === 0}
            >
              <FontAwesomeIcon icon={faFilePdf} style={styles.filterIcon} />

              Export PDF
            </button>
          </div>

          {advancedSearch && (
            <div style={styles.searchOptions}>
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                style={styles.searchSelect}
              >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="position">Position</option>
                <option value="department">Department</option>
              </select>
            </div>
          )}
        </div>

        {error && (
          <div style={styles.alert} className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Note:</strong> {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <div style={styles.retryButtonContainer}>
              <button className="btn btn-sm btn-primary" onClick={handleRetry}>
                Retry Connection
              </button>
            </div>
          </div>
        )}

        <div style={styles.cardGrid}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div key={employee._id} style={styles.employeeCard}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardHeaderContent}>
                      <h6 style={{ margin: 0 }}>{employee.name}</h6>
                      <div style={styles.iconContainer}>
                        <FontAwesomeIcon 
                          icon={faEdit} 
                          style={styles.editIcon}
                          onClick={() => handleEdit(employee._id)}
                          title="Edit HR Officer"
                        />
                        <FontAwesomeIcon 
                          icon={faTrash} 
                          style={styles.deleteIcon}
                          onClick={() => handleDelete(employee._id)}
                          title="Delete HR Officer"
                        />
                      </div>
                    </div>
                  </div>
                  <div style={styles.cardBody}>
                    {cardFields.map((field) => (
                      <p key={field.label} style={styles.cardField}>
                        <strong style={styles.fieldLabel}>{field.label}:</strong>{" "}
                        {field.getValue(employee)}
                      </p>
                    ))}
                    <p style={styles.cardField}>
                      <strong style={styles.fieldLabel}>Status:</strong>{" "}
                      <select
                        value={(employee.availability === "1" || employee.availability === 1) ? 'active' : 'inactive'}
                        onChange={(e) => handleStatusChange(
                          employee._id, 
                          (employee.availability === "1" || employee.availability === 1) ? 'active' : 'inactive',
                          e.target.value
                        )}
                        style={{
                          ...styles.statusSelect,
                          backgroundColor: (employee.availability === "1" || employee.availability === 1) ? "#2ecc71" : "#e74c3c",
                          color: "white"
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              <p>No HR officers found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cardFields = [
  { label: "Position", getValue: (emp) => emp.position },
  { label: "Department", getValue: (emp) => emp.department },
  { label: "Phone", getValue: (emp) => emp.phone },
  { label: "Salary", getValue: (emp) => `$${emp.salary ? emp.salary.toLocaleString() : "N/A"}` },
  { label: "Joined", getValue: (emp) => emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : "N/A" },
  { label: "Email", getValue: (emp) => emp.email },
  { 
    label: "Status", 
    getValue: (emp) => (
      <span>
        <span 
          className={`status-indicator ${emp.availability === "1" || emp.availability === 1 ? "status-active" : "status-inactive"}`} 
          style={styles.statusIndicator}
        ></span>
        {emp.availability === "1" || emp.availability === 1 ? "Active" : "Inactive"}
      </span>
    )
  }
];

const styles = {
  pageContainer: {
    marginLeft: "250px", // Match sidebar width
    padding: "20px",
    transition: "margin-left 0.3s ease",
    width: "calc(100% - 250px)",
    minHeight: "calc(100vh - 60px)", // Account for navbar height
    backgroundColor: "#f5f5f5",
    marginTop: "60px" // Account for navbar height
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },
  loadingContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "2rem",
    textAlign: "center"
  },
  title: {
    fontSize: "28px",
    fontWeight: 500,
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  loadingText: {
    marginTop: "3rem",
    color: "#666"
  },
  alert: {
    marginBottom: "20px"
  },
  retryButtonContainer: {
    marginTop: "2rem"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0"
  },
  employeeCard: {
    transition: "transform 0.3s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)"
    }
  },
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    height: "100%",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#fff"
  },
  cardHeader: {
    backgroundColor: "#fc6625",
  color: "#ffffff",
  padding: "15px",
  fontWeight: "bold"
  },
  cardHeaderText: {
    color: "#fff",
    fontWeight: "bold",
    margin: 0
  },
  cardBody: {
    padding: "20px"
  },
  cardField: {
    marginBottom: "8px",
    fontSize: "14px"
  },
  fieldLabel: {
    fontWeight: 600,
    display: "inline-block",
    width: "85px"
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px",
    backgroundColor: "currentColor"
  },
  searchContainer: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  searchControls: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    justifyContent: "center"
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
    maxWidth: "500px"
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px 12px 45px",
    fontSize: "14px",
    border: "2px solid #e0e0e0",
    borderRadius: "25px",
    outline: "none",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#ff7043"
    }
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666"
  },
  filterIcon: {
    fontSize: "14px",
    marginRight: "8px"
  },
  advancedSearchButton: {
    padding: "10px 20px",
    borderRadius: "25px",
    border: "2px solid #e0e0e0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500"
  },
  pdfButton: {
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#ff7043",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
    "&:hover": {
      backgroundColor: "#f4511e"
    }
  },
  searchOptions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  searchSelect: {
    padding: "8px 15px",
    borderRadius: "20px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "150px",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#ff7043"
    }
  },
  cardHeaderContent: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%"
},
deleteIcon: {
  fontSize: "16px",
  color: "#ffffff",
  opacity: "0.8",
  cursor: "pointer",
  transition: "all 0.2s ease",
  padding: "4px",
  "&:hover": {
    opacity: "1",
    transform: "scale(1.1)"
  },
  "&:active": {
    transform: "scale(0.95)"
  }
},
editIcon: {
  fontSize: "16px",
  color: "#ffffff",
  opacity: "0.8",
  cursor: "pointer",
  transition: "all 0.2s ease",
  padding: "4px",
  "&:hover": {
    opacity: "1",
    transform: "scale(1.1)"
  },
  "&:active": {
    transform: "scale(0.95)"
  }
},
iconContainer: {
  display: "flex",
  gap: "10px"
},
statusSelect: {
  padding: "5px 10px",
  borderRadius: "5px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  "&:hover": {
    opacity: "0.9"
  }
}

};