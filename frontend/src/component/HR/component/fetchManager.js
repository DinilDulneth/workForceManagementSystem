import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function FetchManager() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  useEffect(() => {
    getManagers();
  }, []);

  function getManagers() {
    setLoading(true);
    setError(null);

    const fetchPromise = axios.get("http://localhost:8070/manager/getManager", {
      timeout: 5000
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setManagers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching managers:", err);
        setError("Could not connect to the server. Please try again.");
        setLoading(false);
      });
  }

  const handleRetry = () => {
    getManagers();
  };

  const filteredManagers = managers.filter((manager) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    switch (searchField) {
      case "name":
        return manager.name?.toLowerCase().includes(term);
      case "email":
        return manager.email?.toLowerCase().includes(term);
      case "position":
        return manager.position?.toLowerCase().includes(term);
      case "department":
        return manager.department?.toLowerCase().includes(term);
      case "all":
      default:
        return Object.values(manager).some((value) =>
          String(value).toLowerCase().includes(term)
        );
    }
  });

  const downloadManagersPDF = () => {
    try {
      toast.info("Preparing managers list PDF...", {
        position: "top-right",
        autoClose: 2000
      });

      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("Managers List Report", 14, 15);

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

      const tableRows = filteredManagers.map(manager => [
        manager.name || "N/A",
        manager.position || "N/A",
        manager.department || "N/A",
        manager.email || "N/A",
        manager.phone || "N/A",
        manager.salary ? `$${manager.salary.toLocaleString()}` : "N/A",
        manager.dateOfJoining ? new Date(manager.dateOfJoining).toLocaleDateString() : "N/A",
        manager.availability === "1" || manager.availability === 1 ? "Active" : "Inactive"
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
          fillColor: [252, 102, 37],
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

      doc.save(`Managers_List_${new Date().toISOString().split('T')[0]}.pdf`);

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

  if (loading) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.loadingContainer}>
          <h3 style={styles.header}>
            Managers Data
            <span style={styles.headerUnderline}></span>
          </h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "20px", color: "#666" }}>Loading manager data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <h2 style={styles.header}>
        Managers Data
        <span style={styles.headerUnderline}></span>
      </h2>

      <div style={styles.searchContainer}>
        <div style={styles.searchControls}>
          <button
            style={{
              ...styles.advancedSearchButton,
              backgroundColor: advancedSearch ? "#fc6625" : "#fff",
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
              placeholder={`Search ${searchField === "all" ? "managers" : searchField}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button
            onClick={downloadManagersPDF}
            style={{
              ...styles.pdfButton,
              opacity: filteredManagers.length === 0 ? 0.7 : 1,
              cursor: filteredManagers.length === 0 ? 'not-allowed' : 'pointer'
            }}
            disabled={filteredManagers.length === 0}
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
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Note:</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          <div className="mt-2">
            <button className="btn btn-sm btn-primary" onClick={handleRetry}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <div style={styles.cardContainer}>
        {filteredManagers.length > 0 ? (
          filteredManagers.map((manager) => (
            <div
              key={manager._id}
              style={styles.employeeCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={styles.cardHeader}>
                <h6 style={{ margin: 0 }}>{manager.name}</h6>
              </div>
              <div style={styles.cardBody}>
                {cardFields.map((field) => (
                  <p key={field.label} style={styles.cardField}>
                    <strong style={styles.fieldLabel}>{field.label}:</strong>{" "}
                    {field.getValue(manager)}
                  </p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <p>No managers found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const cardFields = [
  { label: 'Position', getValue: (emp) => emp.position },
  { label: 'Department', getValue: (emp) => emp.department },
  { label: 'Phone', getValue: (emp) => emp.phone },
  { label: 'Salary', getValue: (emp) => `$${emp.salary ? emp.salary.toLocaleString() : 'N/A'}` },
  { label: 'Joined', getValue: (emp) => emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A' },
  { label: 'Email', getValue: (emp) => emp.email },
  { 
    label: 'Status', 
    getValue: (emp) => (
      <span>
        <span 
          className={`status-indicator ${emp.availability === "1" || emp.availability === 1 ? "status-active" : "status-inactive"}`} 
          style={{
            ...styles.statusIndicator,
            backgroundColor: emp.availability === "1" || emp.availability === 1 ? "#2ecc71" : "#e74c3c"
          }}
        ></span>
        {emp.availability === "1" || emp.availability === 1 ? "Active" : "Inactive"}
      </span>
    )
  }
];


const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    maxWidth: "calc(100vw - 250px)",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "1.8rem",
    position: "relative",
    paddingBottom: "15px"
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    backgroundColor: "#fc6625"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px"
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    overflow: "hidden"
  },
  cardHeader: {
    backgroundColor: "#fc6625",
    color: "#ffffff",
    padding: "15px",
    fontWeight: "bold"
  },
  cardBody: {
    padding: "20px"
  },
  infoRow: {
    marginBottom: "8px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center"
  },
  infoLabel: {
    fontWeight: 600,
    display: "inline-block",
    width: "85px",
    color: "#2c3e50"
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    padding: "0 20px"
  },
  searchControls: {
    display: "flex",
    gap: "15px",
    width: "100%",
    maxWidth: "700px",
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
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "25px",
    outline: "none",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#fc6625"
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
    fontSize: "12px",
    marginRight: "8px"
  },
  advancedSearchButton: {
    padding: "10px 20px",
    borderRadius: "25px",
    border: "2px solid #ddd",
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
    backgroundColor: "#fc6625",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
    "&:hover": {
      backgroundColor: "#e55a1c"
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
      opacity: 0.7
    }
  },
  searchOptions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    width: "100%",
    maxWidth: "700px"
  },
  searchSelect: {
    padding: "8px 15px",
    borderRadius: "20px",
    border: "2px solid #ddd",
    outline: "none",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
    minWidth: "150px",
    "&:focus": {
      borderColor: "#fc6625"
    }
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)"
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px"
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
    fontSize: "16px",
    gridColumn: "1 / -1"
  }
};