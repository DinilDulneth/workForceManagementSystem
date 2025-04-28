import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FetchSalary() {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSalary();
  }, []);

  function getSalary() {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:8070/salary/")
      .then((res) => {
        setSalaries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function deleteSalary(id) {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      axios
        .delete(`http://localhost:8070/salary/delete/${id}`)
        .then(() => {
          setSalaries(salaries.filter((salary) => salary._id !== id));
          alert("Salary deleted successfully ✅");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Salary Records</h2>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={styles.loadingText}>Loading salary records...</p>
          </div>
        ) : error ? (
          <div style={styles.alert} className="alert alert-warning">
            {error}
          </div>
        ) : (
          <div style={styles.salaryList}>
            {salaries.map((salary) => (
              <div key={salary._id} style={styles.salaryCard}>
                <div style={styles.cardContent}>
                  <div style={styles.salaryHeader}>
                    <h5 style={styles.employeeName}>{salary.name}</h5>
                    <span style={styles.employeeId}>ID: {salary.employeeId}</span>
                  </div>
                  <div style={styles.salaryDetails}>
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Paid Hours:</span> {salary.paidHours} hrs
                    </p>
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Gross Pay:</span> ${salary.grossPay}
                    </p>
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Deductions:</span> ${salary.deductions}
                    </p>
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Net Pay:</span> ${salary.netPay}
                    </p>
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Status:</span> {salary.salaryStatus}
                    </p>
                  </div>
                  <div style={styles.buttonGroup}>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteSalary(salary._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/HRDashboard/updateSalary/${salary._id}`)}
                      style={styles.updateButton}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    color: "#333",
    textAlign: "center",
    marginBottom: "30px"
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px"
  },
  loadingText: {
    marginTop: "20px",
    color: "#666"
  },
  salaryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  salaryCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)"
    }
  },
  cardContent: {
    padding: "20px"
  },
  salaryHeader: {
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
    marginBottom: "15px"
  },
  employeeName: {
    margin: "0 0 5px 0",
    color: "#ff7043",
    fontSize: "18px",
    fontWeight: "600"
  },
  employeeId: {
    color: "#666",
    fontSize: "14px"
  },
  salaryDetails: {
    marginBottom: "20px"
  },
  detailItem: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#333"
  },
  label: {
    fontWeight: "600",
    width: "100px",
    display: "inline-block",
    color: "#666"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px"
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#c82333"
    }
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#ff7043",
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f4511e"
    }
  },
  alert: {
    marginBottom: "20px",
    borderRadius: "8px"
  }
};