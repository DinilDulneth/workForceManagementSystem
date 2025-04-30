import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AccessView() {
  const navigate = useNavigate();
  const [accessRecords, setAccessRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAccessRecords();
  }, []);

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
          alert("Access record deleted successfully");
          setAccessRecords(accessRecords.filter((record) => record._id !== id));
        })
        .catch((err) => {
          alert("Error deleting record: " + err.message);
        });
    }
  }

  function revokeAccess(id) {
    if (window.confirm("Are you sure you want to revoke this user's access?")) {
      axios
        .patch(`http://localhost:8070/access/revokeAccess/${id}`)
        .then(() => {
          alert("Access revoked successfully");
          getAccessRecords(); // Refresh the records
        })
        .catch((err) => {
          alert("Error revoking access: " + err.message);
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
          alert("Access restored successfully");
          getAccessRecords();
        })
        .catch((err) => {
          alert("Error restoring access: " + err.message);
        });
    }
  }

  const handleRetry = () => {
    getAccessRecords();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>
          Access Records
        </h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Loading access records...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <div style={styles.gridContainer}>
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h4>Total Users</h4>
            <p style={styles.cardNumber}>{accessRecords.length}</p>
          </div>
          <div style={styles.card}>
            <h4>Active Users</h4>
            <p style={styles.cardNumber}>
              {
                accessRecords.filter(
                  (record) => record.access !== "99" && record.status === "1"
                ).length
              }
            </p>
          </div>
          <div style={styles.card}>
            <h4>Revoked Users</h4>
            <p style={styles.cardNumber}>
              {accessRecords.filter((record) => record.access === "99").length}
            </p>
          </div>
        </div>

        <h2 style={styles.header}>Access Management</h2>

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

        {/* Active Users Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.subHeader}>Active Users</h3>
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
              {accessRecords
                .filter((record) => record.access !== "99")
                .map((record) => (
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
                    <td style={styles.tableCell}>
                      <button
                        className="btn btn-sm"
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() =>
                          navigate(`/HRDashboard/AccessUpdate/${record._id}`)
                        }
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
        </div>

        {/* Revoked Users Table */}
        <h3 style={styles.subHeader}>Revoked Users</h3>
        <div style={styles.tableContainer}>
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
              {accessRecords
                .filter((record) => record.access === "99")
                .map((record) => (
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
        </div>
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
    transition: "all 0.3s ease",
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
  header: {
    color: "#2c3e50",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "3px solid #fc6625",
  },
  subHeader: {
    color: "#2c3e50",
    marginBottom: "15px",
    fontSize: "1.5rem",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
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
};
