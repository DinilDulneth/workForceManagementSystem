import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export default function FetchResignations() {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResignations();
  }, []);

  function getResignations() {
    setLoading(true);
    setError(null);

    axios.get(`http://localhost:8070/resignation/getempRes`, { timeout: 5000 })
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

  function deleteResignation(id) {
    if (window.confirm("Are you sure you want to delete this resignation?")) {
      axios
        .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
        .then(() => {
          setResignations(resignations.filter((resignation) => resignation._id !== id));
          alert("Resignation deleted successfully");
        })
        .catch((err) => {
          alert("Error deleting resignation: " + err.message);
        });
    }
  }

  const handleRetry = () => {
    getResignations();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>Resignations Data</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>Loading resignation data...</p>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <h2 style={styles.header}>Resignation Records</h2>

      {error && (
        <div style={styles.alertBox} className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Note:</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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

      <div style={styles.tableContainer}>
        <table className="table table-hover mb-0">
          <thead style={{ backgroundColor: "#2c3e50", color: "white" }}>
            <tr>
              <th style={{ padding: "15px", width: "15%" }}>Employee ID</th>
              <th style={{ padding: "15px", width: "45%" }}>Reason</th>
              <th style={{ padding: "15px", width: "20%" }}>End Date</th>
              <th style={{ padding: "15px", width: "20%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resignations.length > 0 ? (
              resignations.map((resignation) => (
                <tr key={resignation._id}>
                  <td style={{ padding: "12px 15px" }}>{resignation.empId}</td>
                  <td style={{ padding: "12px 15px" }}>{resignation.Reason}</td>
                  <td style={{ padding: "12px 15px" }}>
                    {new Date(resignation.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 15px" }}>
                    <button
                      className="btn btn-sm"
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={() => navigate(`/EmployeeDashboard/ResignationU/${resignation._id}`)}
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
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No resignation records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    transition: "all 0.3s ease"
  },
  header: {
    color: "#2c3e50",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "3px solid #fc6625"
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
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
  button: {
    transition: "all 0.3s ease",
    margin: "0 5px",
    padding: "5px 15px"
  },
  editButton: {
    backgroundColor: "#3498db",
    border: "none",
    color: "white",
    '&:hover': {
      backgroundColor: "#2980b9"
    }
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    '&:hover': {
      backgroundColor: "#c0392b"
    }
  },
  alertBox: {
    marginBottom: "20px",
    borderRadius: "8px"
  }
};