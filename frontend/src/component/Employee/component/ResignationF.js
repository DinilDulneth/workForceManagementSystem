import React, { useState } from "react";
import axios from "axios";

export default function ResignationF() {
  const ID = localStorage.getItem("ID");
  const name = localStorage.getItem("Name");
  
  const [submitted, setsubmitted] = useState(false);
  const [empID, setempID] = useState(ID);
  const [empName, setempName] = useState(name);
  const [reason, setreason] = useState("");
  const [endDate, setendDate] = useState("");

  function setResignation(e) {
    e.preventDefault();
    const newResignation = {
      empId: empID,
      Reason: reason,
      endDate
    };
    axios
      .post("http://localhost:8070/resignation/addempRes", newResignation)
      .then((res) => {
        alert("Resignation Added Successfully!✅");
        setsubmitted(true);
        setempID("");
        setreason("");
        setendDate("");
      })
      .catch((err) => {
        alert("Error adding Task: " + err.message);
      });
    console.log(newResignation);
  }

  return (
    
    <div style={styles.mainContent}>
    
      <div style={styles.formContainer}>
        {submitted ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3
              style={{
                color: "#474747",
                fontSize: "1.5rem",
                marginBottom: "1rem"
              }}
            >
              Resignation Submitted
            </h3>
            <p style={{ color: "#8f9491", fontSize: "1rem" }}>
              Your resignation has been successfully submitted.
            </p>
          </div>
        ) : (
          <>
            <h2 style={styles.header}>
              Employee Resignation
              <span style={styles.headerUnderline}></span>
            </h2>
            <form onSubmit={setResignation}>
              <div style={styles.formGroup}>
                <label htmlFor="lastWorkingDate" style={styles.label}>
                  Last Working Date:
                  <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="date"
                  id="lastWorkingDate"
                  value={endDate}
                  onChange={(e) => setendDate(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="reason" style={styles.label}>
                  Reason for Resignation:
                  <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setreason(e.target.value)}
                  placeholder="Please provide your reason for resignation"
                  required
                  style={{ ...styles.input, ...styles.textarea }}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.submitButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e55a1c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fc6625")
                  }
                >
                  Submit Resignation
                </button>
               
                <button
                  type="button"
                  onClick={() => setsubmitted(false)}
                  style={styles.cancelButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ffffff")
                  }
                >
                  Cancel
                </button>
                
              </div>
              <br></br>
              <p>Hey {name}!! Are you sure , you want to quit ??</p>
            </form>
          </>
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
    transition: "all 0.3s ease"
  },
  textarea: {
    minHeight: "120px",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.5
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem"
  },
  submitButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#fc6625",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#474747",
    border: "1px solid #8f9491",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  successContainer: {
    textAlign: "center",
    padding: "2rem 1rem"
  },
  successIcon: {
    width: "70px",
    height: "70px",
    backgroundColor: "#2ecc71",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    margin: "0 auto 1.5rem"
  }
};