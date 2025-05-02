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
    axios
      .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
      .then(() => {
        alert("Resignation deleted successfully");
        setResignations(
          resignations.filter((resignation) => resignation._id !== id)
        ); // Update UI
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  // Function to retry API call
  const handleRetry = () => {
    getResignations();
  };

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

        <h2 style={styles.header}>Resignation Records</h2>

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

        <div style={styles.tableContainer}>
          <table className="table table-hover mb-0">
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Employee ID</th>
                <th style={styles.tableHeaderCell}>Reason</th>
                <th style={styles.tableHeaderCell}>End Date</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resignations.length > 0 ? (
                resignations.map((resignation) => (
                  <tr key={resignation._id}>
                    <td style={styles.tableCell}>{resignation.empId}</td>
                    <td style={styles.tableCell}>{resignation.Reason}</td>
                    <td style={styles.tableCell}>
                      {new Date(resignation.endDate).toLocaleDateString()}
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
                  <td colSpan="4" style={styles.emptyMessage}>
                    No resignation records found.
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
  }
};
