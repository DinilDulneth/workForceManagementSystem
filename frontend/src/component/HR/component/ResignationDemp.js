import React, { useState, useEffect } from "react";
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

    const fetchPromise = axios.get("http://localhost:8070/resignation/getempRes", {
      timeout: 5000
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((res) => {
        setResignations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resignations:", err);
        setError("Could not connect to the server.");
        setLoading(false);
      });
  }

  function deleteResignation(id) {
    axios
      .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
      .then(() => {
        setResignations(resignations.filter((resignation) => resignation._id !== id));
        alert("Resignation deleted successfully");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <p style={styles.title}>Resignation List</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={styles.loadingText}>Loading resignations...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Resignation List</h2>

        {error && (
          <div style={styles.alert} className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Note:</strong> {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <div style={styles.retryButtonContainer}>
              <button className="btn btn-sm btn-primary" onClick={getResignations}>
                Retry Connection
              </button>
            </div>
          </div>
        )}

        <div style={styles.cardGrid}>
          {resignations.map((resignation) => (
            <div key={resignation._id} style={styles.resignationCard}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h6 style={styles.cardHeaderText}>Employee ID: {resignation.empId}</h6>
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.cardField}>
                    <strong style={styles.fieldLabel}>Reason:</strong> {resignation.Reason}
                  </p>
                  <div style={styles.buttonContainer}>
                    <button
                      className="btn btn-danger"
                      style={styles.deleteButton}
                      onClick={() => deleteResignation(resignation._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary"
                      style={styles.updateButton}
                      onClick={() => navigate(`/update/${resignation._id}`)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
  resignationCard: {
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
    backgroundColor: "#ff7043",
    padding: "15px",
    borderBottom: "none"
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
    marginBottom: "15px",
    fontSize: "14px"
  },
  fieldLabel: {
    fontWeight: 600,
    marginRight: "8px"
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    border: "none",
    "&:hover": {
      backgroundColor: "#c82333"
    }
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#0d6efd",
    border: "none",
    "&:hover": {
      backgroundColor: "#0056b3"
    }
  }
};