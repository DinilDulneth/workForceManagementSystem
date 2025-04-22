import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function FetchInquiry() {
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInquiry();
  }, []);

  function getInquiry() {
    setLoading(true);
    setError(null);
    
    axios
      .get("http://localhost:8070/api/inquiry/getInquiry")
      .then((res) => {
        setInquiry(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching inquiries: " + err.message);
        setLoading(false);
      });
  }

  function deleteInquiry(id) {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      axios
        .delete(`http://localhost:8070/api/inquiry/deleteInquiry/${id}`)
        .then(() => {
          setInquiry(inquiry.filter((inq) => inq._id !== id));
          alert("Inquiry deleted successfully ✅");
        })
        .catch((err) => {
          alert("Error deleting inquiry: " + err.message);
        });
    }
  }

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={styles.loadingText}>Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Inquiry List</h2>

        {error && (
          <div style={styles.alert} className="alert alert-warning">
            {error}
          </div>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Employee ID</th>
                <th style={styles.tableHeader}>Inquiry</th>
                <th style={styles.tableHeader}>Sender</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiry.map((inq) => (
                <tr key={inq._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{inq.employeeId}</td>
                  <td style={styles.tableCell}>{inq.inquiry}</td>
                  <td style={styles.tableCell}>{inq.sender}</td>
                  <td style={styles.tableCell}>
                    {new Date(inq.date).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.buttonGroup}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteInquiry(inq._id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/updateInquiry/${inq._id}`)}
                        style={styles.updateButton}
                      >
                        Update
                      </button>
                    </div>
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
  pageContainer: {
    marginLeft: "250px",
    padding: "20px",
    transition: "margin-left 0.3s ease",
    width: "calc(100% - 250px)",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f5f5f5",
    marginTop: "60px"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff"
  },
  tableHeader: {
    backgroundColor: "#ff7043",
    color: "#fff",
    padding: "15px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px"
  },
  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f9f9f9"
    }
  },
  tableCell: {
    padding: "15px",
    fontSize: "14px",
    color: "#333"
  },
  buttonGroup: {
    display: "flex",
    gap: "8px"
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    border: "none",
    padding: "4px 8px",
    fontSize: "12px"
  },
  updateButton: {
    backgroundColor: "#ff7043",
    border: "none",
    padding: "4px 8px",
    fontSize: "12px"
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "2rem"
  },
  loadingText: {
    marginTop: "1rem",
    color: "#666"
  },
  alert: {
    marginBottom: "20px",
    borderRadius: "8px"
  }
};

export default FetchInquiry;