import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddInquiry() {
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [sender, setSender] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState(""); // New state for department

  useEffect(() => {
    setDate(new Date().toISOString());
    const userId = getCurrentUserId();
    setSender(userId);
  }, []);

  function getCurrentUserId() {
    // Replace this with your actual method to get the user ID
    return "605c72ef2f799e2a4c8b4567"; // Example user ID
  }

  function sendInquiryData(e) {
    e.preventDefault(); // Prevents form from reloading

    const newInquiry = {
      employeeId,
      inquiry,
      sender,
      date,
      department, // Add department to the inquiry object
    };

    axios
      .post("http://localhost:8070/api/inquiry/addInquiry", newInquiry)
      .then(() => {
        alert("Inquiry Added Successfully! ✅");
        setEmployeeId("");
        setInquiry("");
        setSender("");
        setDate("");
        setDepartment(""); // Reset department after submission
        navigate("/fetchInquiry");
      })
      .catch((err) => {
        alert("Error adding Inquiry: " + err.message);
      });

    console.log(newInquiry);
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Submit New Inquiry</h2>
          </div>
          
          <div style={styles.cardBody}>
            <form onSubmit={sendInquiryData} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Employee ID</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter Employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Inquiry Details</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Enter your inquiry details"
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <select
                  style={styles.select}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="General Manager">General Manager</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                  Submit Inquiry
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate("/fetchInquiry")}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    fontWeight: "500",
    textAlign: "center"
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
    color: "#455a64",
    fontWeight: "500",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#ff7043",
      outline: "none"
    }
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    minHeight: "120px",
    resize: "vertical",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#ff7043",
      outline: "none"
    }
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
    "&:focus": {
      borderColor: "#ff7043",
      outline: "none"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "30px"
  },
  submitButton: {
    flex: "1",
    padding: "12px",
    backgroundColor: "#ff7043",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f4511e"
    }
  },
  cancelButton: {
    flex: "1",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#455a64",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "#455a64"
    }
  }
};