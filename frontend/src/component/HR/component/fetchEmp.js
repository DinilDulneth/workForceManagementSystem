import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

export default function FetchEmp() {
  // State management
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    getEmployee();
  }, []);

  // API call to fetch employees
  function getEmployee() {
    setLoading(true);
    setError(null);

    const fetchPromise = axios.get("http://localhost:8070/employee/getEmp", {
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
        console.error("Error fetching employees:", err);
        setError("Could not connect to the server. Please try again.");
        setLoading(false);
      });
  }

  // Retry handler
  const handleRetry = () => {
    getEmployee();
  };

  // Filter employees based on search criteria
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

  // Loading state
  if (loading) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.loadingContainer}>
          <h3 style={styles.header}>
            Employees Data
            <span style={styles.headerUnderline}></span>
          </h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "20px", color: "#666" }}>Loading employee data...</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div style={styles.mainContent}>
      <h2 style={styles.header}>
        Employees Data
        <span style={styles.headerUnderline}></span>
      </h2>

      {/* Search Section */}
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
              placeholder={Search ${searchField === 'all' ? 'employees' : searchField}...}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
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

      {/* Error Message */}
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

      {/* Employee Cards */}
      <div style={styles.cardContainer}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              style={styles.employeeCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={styles.cardHeader}>
                <h6 style={{ margin: 0 }}>{employee.name}</h6>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Position:</strong> {employee.position}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Department:</strong> {employee.department}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Phone:</strong> {employee.phone}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Salary:</strong> ${employee.salary?.toLocaleString() || "N/A"}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Joined:</strong>{" "}
                  {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : "N/A"}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Email:</strong> {employee.email}
                </p>
                <p style={styles.infoRow}>
                  <strong style={styles.infoLabel}>Status:</strong>{" "}
                  <span
                    style={{
                      ...styles.statusIndicator,
                      backgroundColor: employee.availability === "1" || employee.availability === 1 ? "#2ecc71" : "#e74c3c",
                    }}
                  ></span>
                  {employee.availability === "1" || employee.availability === 1 ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <p>No employees found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    maxWidth: "calc(100vw - 250px)",
    backgroundColor: "#f8f9fa",
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "1.8rem",
    position: "relative",
    paddingBottom: "15px",
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "3px",
    backgroundColor: "#fc6625",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#fc6625",
    color: "#ffffff",
    padding: "15px",
    fontWeight: "bold",
  },
  cardBody: {
    padding: "20px",
  },
  infoRow: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  infoLabel: {
    fontWeight: 600,
    display: "inline-block",
    width: "85px",
    color: "#2c3e50",
  },
  statusIndicator: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "5px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    padding: "0 20px",
  },
  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "500px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
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
      borderColor: "#fc6625",
    },
  },
  searchControls: {
    display: "flex",
    gap: "15px",
    width: "100%",
    maxWidth: "700px",
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
    fontWeight: "500",
  },
  
  filterIcon: {
    fontSize: "12px",
  },
  
  searchOptions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    width: "100%",
    maxWidth: "700px",
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
    "&:focus": {
      borderColor: "#fc6625",
    },
  },
};
