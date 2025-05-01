import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSalary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
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

  // Calculate net pay whenever grossPay or deductions change
  useEffect(() => {
    const grossPayNum = parseFloat(salary.grossPay) || 0;
    const deductionsNum = parseFloat(salary.deductions) || 0;
    const netPay = Math.max(0, grossPayNum - deductionsNum).toFixed(2);
    
    setSalary(prev => ({
      ...prev,
      netPay: netPay
    }));
  }, [salary.grossPay, salary.deductions]);

  // Add this new function to fetch employee data
  const fetchEmployeeData = async (employeeId) => {
    if (!employeeId) return;
    
    setFetchingEmployee(true);
    try {
      const response = await axios.get(`http://localhost:8070/salary/employee/${employeeId}`);
      const employeeData = response.data;
      
      // Auto-fill the form with employee data
      setSalary(prev => ({
        ...prev,
        name: employeeData.name,
        employeeId: employeeData.ID
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Employee not found!");
      } else {
        console.error("Error fetching employee:", error);
        alert("Error fetching employee data");
      }
    } finally {
      setFetchingEmployee(false);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setSalary(prev => ({
      ...prev,
      [name]: value,
    }));

    // If employee ID field changes, fetch employee data
    if (name === "employeeId" && value.length > 0) {
      fetchEmployeeData(value);
    }
  }

  async function addSalaryData(e) {
    e.preventDefault();
    setLoading(true);

    const salaryData = {
      ...salary,
      paidHours: parseFloat(salary.paidHours) || 0,
      grossPay: parseFloat(salary.grossPay) || 0,
      deductions: parseFloat(salary.deductions) || 0,
      netPay: parseFloat(salary.netPay) || 0,
    };

    try {
      await axios.post("http://localhost:8070/salary/add", salaryData);
      alert("Salary Added Successfully! ✅");
      navigate("/HRDashboard/fetchSalary");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error adding salary: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  // Modified input field for Employee ID with debounce
  const employeeIdInput = (
    <div style={styles.formGroup}>
      <label style={styles.label}>Employee ID</label>
      <div style={styles.inputGroup}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Employee ID"
          name="employeeId"
          value={salary.employeeId}
          onChange={handleChange}
          style={styles.input}
        />
        {fetchingEmployee && (
          <div style={styles.spinner}>
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const formFields = [
    { label: "Name", name: "name", type: "text", placeholder: "Enter Name", readOnly: true },
    { label: "Paid Hours", name: "paidHours", type: "number", placeholder: "Paid Hours" },
    { label: "Statutory Pay", name: "statutoryPay", type: "text", placeholder: "Enter Statutory Pay" },
    { label: "Gross Pay", name: "grossPay", type: "number", placeholder: "Gross Pay" },
    { label: "Deductions", name: "deductions", type: "number", placeholder: "Deductions" },
    { label: "Net Pay", name: "netPay", type: "number", placeholder: "Net Pay", readOnly: true }
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Add Salary Details</h2>
          </div>
          
          <div style={styles.cardBody}>
            <form onSubmit={addSalaryData}>
              {employeeIdInput}
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
                    readOnly={field.readOnly}
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
                  disabled={loading || !salary.employeeId || !salary.grossPay}
                >
                  {loading ? "Adding..." : "Add Salary"}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate("/HRDashboard/fetchSalary")}
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

// Add these new styles to your existing styles object
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
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  spinner: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
};