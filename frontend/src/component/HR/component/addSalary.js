import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSalary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState({
    name: "",
    employeeId: "",
    paidHours: "",
    grossPay: "",
    statutoryPay: "",
    deductions: "",
    netPay: "",
    status: "Pending",
  });

  const formFields = [
    { label: "Name", name: "name", type: "text", placeholder: "Enter Name" },
    { label: "Employee ID", name: "employeeId", type: "text", placeholder: "Enter Employee ID" },
    { label: "Paid Hours", name: "paidHours", type: "number", placeholder: "Paid Hours" },
    { label: "Statutory Pay", name: "statutoryPay", type: "text", placeholder: "Enter Statutory Pay" },
    { label: "Gross Pay", name: "grossPay", type: "number", placeholder: "Gross Pay" },
    { label: "Deductions", name: "deductions", type: "number", placeholder: "Deductions" },
    { label: "Net Pay", name: "netPay", type: "number", placeholder: "Net Pay" }
  ];

  async function addSalaryData(e) {
    e.preventDefault();
    setLoading(true);

    const salaryData = {
      ...salary,
      paidHours: Number(salary.paidHours) || 0,
      grossPay: Number(salary.grossPay) || 0,
      deductions: Number(salary.deductions) || 0,
      netPay: Number(salary.netPay) || 0,
    };

    try {
      await axios.post("http://localhost:8070/salary/add", salaryData);
      alert("Salary Added Successfully! ✅");
      navigate("/fetchSalary");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error adding salary: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setSalary(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Add Salary</h2>
          </div>
          
          <div style={styles.cardBody}>
            <form onSubmit={addSalaryData}>
              {formFields.map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    type={field.type}
                    className="form-control"
                    placeholder={field.placeholder}
                    name={field.name}
                    value={salary[field.name]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              ))}

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={salary.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Salary"}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate("/fetchSalary")}
                  disabled={loading}
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
  formGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#455a64",
    fontWeight: "600"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    transition: "border-color 0.3s ease",
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
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f4511e"
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    }
  },
  cancelButton: {
    flex: "1",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#455a64",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    },
    "&:disabled": {
      backgroundColor: "#f5f5f5",
      cursor: "not-allowed"
    }
  }
};