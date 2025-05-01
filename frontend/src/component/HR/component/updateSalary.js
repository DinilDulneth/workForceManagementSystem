import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateSalary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [paidHours, setPaidHours] = useState("");
  const [grossPay, setGrossPay] = useState("");
  const [statutoryPay, setStatutoryPay] = useState("");
  const [deductions, setDeductions] = useState("");
  const [netPay, setNetPay] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    axios
      .get(`http://localhost:8070/salary/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setEmployeeId(data.employeeId);
        setPaidHours(data.paidHours);
        setGrossPay(data.grossPay);
        setStatutoryPay(data.statutoryPay);
        setDeductions(data.deductions);
        setNetPay(data.netPay);
        setStatus(data.status);
      })
      .catch((err) => {
        alert("Error fetching salary: " + err.message);
      });
  }, [id]);

  // Auto-calculate net pay when gross pay or deductions change
  useEffect(() => {
    const grossPayNum = parseFloat(grossPay) || 0;
    const deductionsNum = parseFloat(deductions) || 0;
    const calculatedNetPay = Math.max(0, grossPayNum - deductionsNum).toFixed(2);
    setNetPay(calculatedNetPay);
  }, [grossPay, deductions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSalary = {
      name,
      employeeId,
      paidHours: parseFloat(paidHours) || 0,
      grossPay: parseFloat(grossPay) || 0,
      statutoryPay,
      deductions: parseFloat(deductions) || 0,
      netPay: parseFloat(netPay) || 0,
      status,
    };

    try {
      await axios.put(`http://localhost:8070/salary/update/${id}`, updatedSalary);
      alert("Salary Updated Successfully! ✅");
      navigate("/HRDashboard/fetchSalary");
    } catch (err) {
      alert("Error updating salary: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Update Salary</h2>
        </div>

        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                readOnly
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input
                type="text"
                className="form-control"
                value={employeeId}
                readOnly
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Paid Hours</label>
              <input
                type="number"
                className="form-control"
                value={paidHours}
                onChange={(e) => setPaidHours(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Statutory Pay</label>
              <input
                type="text"
                className="form-control"
                value={statutoryPay}
                onChange={(e) => setStatutoryPay(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gross Pay</label>
              <input
                type="number"
                className="form-control"
                value={grossPay}
                onChange={(e) => setGrossPay(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Deductions</label>
              <input
                type="number"
                className="form-control"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Net Pay</label>
              <input
                type="number"
                className="form-control"
                value={netPay}
                readOnly
                style={{
                  ...styles.input,
                  backgroundColor: "#f8f9fa"
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.input}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitButton}>
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/HRDashboard/fetchSalary")}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginLeft: "250px",
    padding: "20px",
    transition: "margin-left 0.3s ease",
    width: "calc(100% - 250px)",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f5f5f5",
    marginTop: "60px"
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
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
    }
  }
};
