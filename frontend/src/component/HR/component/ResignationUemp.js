import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

export default function UpdateResignation() {
  const { id } = useParams(); // Changed from id to empId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resignation, setResignation] = useState({
    empId: "",
    Reason: "",
    endDate: ""
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8070/resignation/getempResByEmpId/${id}`) // Update endpoint if using new route
      .then((res) => {
        setResignation(res.data); // Assumes single object response
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.status === 404
            ? "No resignation record found for this employee."
            : "Error fetching resignation: " + err.message;
        setError(errorMessage);
        setLoading(false);
      });
  }, [id]);

  function updateResignationData(e) {
    e.preventDefault();

    const updatedResignation = {
      empId: resignation.empId,
      Reason: resignation.Reason,
      endDate: resignation.endDate
    };

    axios
      .put(
        `http://localhost:8070/resignation/updateempRes/${resignation._id}`, // Use _id for update
        updatedResignation
      )
      .then(() => {
        Swal.fire(
          "Updated!",
          "Resignation has been updated successfully.",
          "success"
        );
        navigate("/HRDashboard/ResignationVemp");
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          "Error updating resignation: " + err.message,
          "error"
        );
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setResignation({
      ...resignation,
      [name]: value
    });
  }

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={styles.loadingText}>Loading resignation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Update Resignation</h2>
          </div>

          {error && (
            <div
              style={styles.alert}
              className="alert alert-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <div style={styles.cardBody}>
            <form onSubmit={updateResignationData} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Employee ID</label>
                <input
                  type="text"
                  style={styles.input}
                  name="empId"
                  value={resignation.empId}
                  readOnly
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Reason for Resignation</label>
                <textarea
                  style={styles.textarea}
                  name="Reason"
                  value={resignation.Reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  style={styles.input}
                  name="endDate"
                  value={resignation.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                  Update Resignation
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate("/HRDashboard/ResignationVemp")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles (unchanged)
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px"
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "2rem"
  },
  loadingText: {
    marginTop: "1rem",
    color: "#666"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    overflow: "hidden"
  },
  cardHeader: {
    backgroundColor: "#ff7043",
    padding: "20px",
    color: "#fff"
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "500"
  },
  cardBody: {
    padding: "30px"
  },
  form: {
    width: "100%"
  },
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#333",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    transition: "border-color 0.3s ease"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    transition: "border-color 0.3s ease"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px"
  },
  submitButton: {
    flex: "1",
    padding: "12px",
    backgroundColor: "#ff7043",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.3s ease"
  },
  cancelButton: {
    flex: "1",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },
  alert: {
    margin: "20px",
    borderRadius: "4px"
  }
};
