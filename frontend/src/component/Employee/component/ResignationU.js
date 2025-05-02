import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateResignation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resignation, setResignation] = useState({
    empId: "",
    Reason: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("Fetching resignation with ID:", id);

    // Direct fetch by _id instead of empId
    axios

      .get(`http://localhost:8070/resignation/getempResByEmpId/${id}`)

      .then((res) => {
        console.log("API Response:", res.data);
        const resignationData = res.data;

        if (!resignationData) {
          throw new Error("No resignation data found");
        }

        console.log("Using resignation data:", resignationData);

        // Format the date for the input field
        setResignation({
          ...resignationData,
          endDate: resignationData.endDate
            ? new Date(resignationData.endDate).toISOString().split("T")[0]
            : "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resignation:", err);
        setError(err.message);
        setLoading(false);
        alert("Error fetching resignation: " + err.message);
      });
  }, [id]);

  function updateResignationData(e) {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting update for resignation:", resignation);

    const updatedResignation = {
      Reason: resignation.Reason,
      endDate: resignation.endDate
    };

    console.log("Updating resignation with ID:", id);

    axios
      .put(
        `http://localhost:8070/resignation/updateempRes/${resignation._id}`,
        updatedResignation
      )
      .then((response) => {
        console.log("Update response:", response.data);
        alert("Resignation Updated Successfully! ✅");
        navigate("/EmployeeHome/ResignationV");
      })
      .catch((err) => {
        console.error("Error updating resignation:", err);
        alert("Error updating resignation: " + err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setResignation({
      ...resignation,
      [name]: value
    });
  }

  if (loading)
    return (
      <div style={styles.mainContent}>
        <div style={styles.formContainer}>
          <div style={styles.loadingSpinner}>Loading resignation data...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={styles.mainContent}>
        <div style={styles.formContainer}>
          <div style={styles.errorMessage}>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button
              style={styles.updateButton}
              onClick={() => navigate("/EmployeeHome/ResignationV")}
            >
              Return to Resignations
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>
          Update Resignation
          <span style={styles.headerUnderline}></span>
        </h2>

        <form onSubmit={updateResignationData}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Employee ID
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="text"
              name="empId"
              value={resignation.empId || ""}
              readOnly
              style={{ ...styles.input, ...styles.readOnlyInput }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Reason for Resignation
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <textarea
              name="Reason"
              value={resignation.Reason || ""}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.textarea }}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              End Date
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={resignation.endDate || ""}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.updateButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Resignation"}
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate("/EmployeeHome/ResignationV")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  formContainer: {
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2.5rem",
    marginTop: "20px"
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.8rem",
    position: "relative",
    paddingBottom: "0.75rem"
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
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem"
  },
  label: {
    color: "#474747",
    fontWeight: 500,
    fontSize: "0.95rem"
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #8f9491",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#474747",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa"
  },
  readOnlyInput: {
    backgroundColor: "#e9ecef",
    cursor: "not-allowed"
  },
  textarea: {
    minHeight: "120px",
    resize: "vertical"
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem"
  },
  updateButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#fc6625",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#6c757d",
    border: "1px solid #6c757d",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  loadingSpinner: {
    textAlign: "center",
    padding: "2rem",
    color: "#474747",
    fontSize: "1rem",
  },
  errorMessage: {
    textAlign: "center",
    padding: "2rem",
    color: "#dc3545",
  },

};
