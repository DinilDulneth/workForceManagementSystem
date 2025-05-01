import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FetchSalary() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSalaries();
  }, []);

  const getSalaries = async () => {
    try {
      const response = await axios.get("http://localhost:8070/salary");
      setSalaries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching salaries:", err);
      setError("Could not fetch salary records");
    } finally {
      setLoading(false);
    }
  };

  const deleteSalary = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        await axios.delete(`http://localhost:8070/salary/delete/${id}`);
        toast.success("Salary record deleted successfully");
        getSalaries();
      } catch (err) {
        console.error("Error deleting salary:", err);
        toast.error("Failed to delete salary record");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const calculateTotal = (salary) => {
    const basic = parseFloat(salary.basic) || 0;
    const incentives = parseFloat(salary.additionalIncentives) || 0;
    const reductions = parseFloat(salary.reductions) || 0;
    return (basic + incentives - reductions).toFixed(2);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={styles.loadingText}>Loading salary records...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <ToastContainer />
      <div style={styles.container}>
        <h2 style={styles.header}>Salary Records</h2>
        
        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

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
                    <span style={styles.label}>Basic Salary:</span> {formatCurrency(salary.basic)}
                  </p>
                  {salary.additionalIncentives > 0 && (
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Incentives:</span> +{formatCurrency(salary.additionalIncentives)}
                    </p>
                  )}
                  {salary.reductions > 0 && (
                    <p style={styles.detailItem}>
                      <span style={styles.label}>Reductions:</span> -{formatCurrency(salary.reductions)}
                    </p>
                  )}
                  <p style={styles.totalAmount}>
                    <span style={styles.label}>Total:</span> {formatCurrency(calculateTotal(salary))}
                  </p>
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    className="btn"
                    onClick={() => deleteSalary(salary._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    className="btn"
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
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    marginLeft: "250px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    color: "#2c3e50",
    marginBottom: "2rem",
    textAlign: "center"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  },
  loadingText: {
    marginTop: "20px",
    color: "#666"
  },
  salaryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0"
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
    margin: "10px 0",
    fontSize: "14px",
    color: "#444"
  },
  label: {
    fontWeight: "600",
    marginRight: "5px"
  },
  totalAmount: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px dashed #eee"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px"
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#ff7043",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f4511e"
    }
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#e74c3c",
    border: "1px solid #e74c3c",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#e74c3c",
      color: "#fff"
    }
  }
};