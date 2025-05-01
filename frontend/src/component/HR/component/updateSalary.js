import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateSalary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasValidEmployee, setHasValidEmployee] = useState(false);
  const [salary, setSalary] = useState({
    employeeId: "",
    name: "",
    department: "",
    basic: "",
    additionalIncentives: "",
    reductions: ""
  });

  const lookupEmployee = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:8070/salary/employee/${employeeId}`);
      if (response.data) {
        setSalary(prev => ({
          ...prev,
          name: response.data.name,
          department: response.data.department
        }));
        setHasValidEmployee(true);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Employee not found with this ID");
      setSalary(prev => ({
        ...prev,
        name: "",
        department: ""
      }));
      setHasValidEmployee(false);
    }
  };

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/salary/${id}`);
        setSalary(response.data);
        if (response.data.employeeId) {
          await lookupEmployee(response.data.employeeId);
        }
      } catch (error) {
        console.error("Error fetching salary:", error);
        toast.error("Error loading salary record");
      }
    };
    fetchSalary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const salaryData = {
        ...salary,
        basic: parseFloat(salary.basic) || 0,
        additionalIncentives: parseFloat(salary.additionalIncentives) || 0,
        reductions: parseFloat(salary.reductions) || 0
      };

      await axios.put(`http://localhost:8070/salary/update/${id}`, salaryData);
      toast.success("Salary updated successfully!");
      navigate("/HRDashboard/fetchSalary");
    } catch (error) {
      console.error("Error updating salary:", error);
      toast.error("Failed to update salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>
          Update Salary Record
          <span style={styles.headerUnderline}></span>
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Employee ID
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              value={salary.employeeId}
              onChange={handleChange}
              onBlur={(e) => {
                if (e.target.value) {
                  lookupEmployee(e.target.value);
                }
              }}
              style={{...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
              readOnly
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Employee Name
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={salary.name}
              style={{...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
              readOnly
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Department
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="text"
              name="department"
              value={salary.department}
              style={{...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
              readOnly
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Basic Salary
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <div style={styles.inputGroup}>
              <div style={styles.currencyPrefix}>Rs</div>
              <input
                type="number"
                name="basic"
                value={salary.basic}
                onChange={handleChange}
                style={{...styles.input, paddingLeft: '40px'}}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Additional Incentives
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <div style={styles.inputGroup}>
              <div style={styles.currencyPrefix}>Rs</div>
              <input
                type="number"
                name="additionalIncentives"
                value={salary.additionalIncentives}
                onChange={handleChange}
                style={{...styles.input, paddingLeft: '40px'}}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Reductions
              <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
            </label>
            <div style={styles.inputGroup}>
              <div style={styles.currencyPrefix}>Rs</div>
              <input
                type="number"
                name="reductions"
                value={salary.reductions}
                onChange={handleChange}
                style={{...styles.input, paddingLeft: '40px'}}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Salary"}
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
  );
}

const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
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
    padding: "2.5rem"
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
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#474747",
    fontWeight: 500
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  currencyPrefix: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    zIndex: 1,
    fontSize: "14px",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    transition: "all 0.2s ease-in-out",
    "&:focus": {
      borderColor: "#fc6625",
      outline: "none"
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem"
  },
  submitButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#fc6625",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e55a1c"
    },
    "&:disabled": {
      backgroundColor: "#ffa07a",
      cursor: "not-allowed"
    }
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "white",
    color: "#6c757d",
    border: "1px solid #6c757d",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8f9fa"
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed"
    }
  }
};
