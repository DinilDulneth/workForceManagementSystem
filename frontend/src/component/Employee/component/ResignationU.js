import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateResignation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resignation, setResignation] = useState({
    empId: "",
    Reason: "",
    endDate: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/resignation/getempResByID/${id}`)
      .then((res) => {
        setResignation(res.data);
      })
      .catch((err) => {
        alert("Error fetching resignation: " + err.message);
      });
  }, [id]);

  function updateResignationData(e) {
    e.preventDefault();

    const updatedResignation = {
      empId: resignation.empId,
      Reason: resignation.Reason,
      endDate: resignation.endDate,
    };

    axios
      .put(
        `http://localhost:8070/resignation/updateempRes/${id}`,
        updatedResignation
      )
      .then(() => {
        alert("Resignation Updated Successfully! ✅");
        navigate("/EmployeeDashboard/ResignationV");
      })
      .catch((err) => {
        alert("Error updating resignation: " + err.message);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setResignation({
      ...resignation,
      [name]: value,
    });
  }

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
              value={resignation.empId}
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
              value={resignation.Reason}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.textarea }}
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
              value={resignation.endDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.updateButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e55a1c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fc6625")
              }
            >
              Update Resignation
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
    alignItems: "flex-start",
  },
  formContainer: {
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2.5rem",
    marginTop: "20px",
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.8rem",
    position: "relative",
    paddingBottom: "0.75rem",
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
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  label: {
    color: "#474747",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #8f9491",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#474747",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
  },
  readOnlyInput: {
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
  },
  textarea: {
    minHeight: "120px",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
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
};
