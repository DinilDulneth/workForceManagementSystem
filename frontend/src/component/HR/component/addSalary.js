import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

const AddSalary = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidEmployee, setHasValidEmployee] = useState(false);

  const initialValues = {
    employeeId: '',
    name: '',
    department: '',
    basic: '',
    additionalIncentives: '0',
    reductions: '0'
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    try {
      const salaryData = {
        ...values,
        basic: parseFloat(values.basic),
        additionalIncentives: parseFloat(values.additionalIncentives),
        reductions: parseFloat(values.reductions)
      };

      const response = await axios.post('http://localhost:8070/salary/add', salaryData);
      alert('Salary record added successfully!✅');
      setSubmitted(true);
      resetForm();
    } catch (error) {
      alert('Error adding salary record: ' + error.message);
      console.error('Error adding salary:', error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const lookupEmployee = async (employeeId, setFieldValue) => {
    try {
      const response = await axios.get(`http://localhost:8070/salary/employee/${employeeId}`);
      if (response.data) {
        // Populate relevant fields only
        setFieldValue('name', response.data.name);
        setFieldValue('employeeId', response.data.ID);
        setFieldValue('department', response.data.department);
        setHasValidEmployee(true);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Employee not found with this ID');
      // Clear form fields if employee is not found
      setFieldValue('name', '');
      setFieldValue('department', '');
      setHasValidEmployee(false);
    }
  };

  const formFields = [
    { 
      name: "employeeId", 
      label: "Employee ID", 
      type: "text",
      style: field => ({
        backgroundColor: hasValidEmployee ? "#e9ecef" : "white",
        cursor: hasValidEmployee ? "not-allowed" : "text"
      })
    },
    { 
      name: "name", 
      label: "Employee Name", 
      type: "text", 
      readOnly: true,
      style: {
        backgroundColor: "#e9ecef",
        cursor: "not-allowed"
      }
    },
    { 
      name: "department", 
      label: "Department", 
      type: "text", 
      readOnly: true,
      style: {
        backgroundColor: "#e9ecef",
        cursor: "not-allowed"
      }
    },
    { name: "basic", label: "Basic Salary (Rs)", type: "number" },
    { name: "additionalIncentives", label: "Additional Incentives (Rs)", type: "number" },
    { name: "reductions", label: "Reductions (Rs)", type: "number" }
  ];

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        {submitted ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Salary Record Added</h3>
            <p style={styles.successText}>
              The salary record has been successfully added to the system.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={styles.submitButton}
            >
              Add Another Salary Record
            </button>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                <h2 style={styles.header}>
                  Add Salary Record
                  <span style={styles.headerUnderline}></span>
                </h2>

                {formFields.map((field) => (
                  <div key={field.name} style={styles.formGroup}>
                    <label htmlFor={field.name} style={styles.label}>
                      {field.label}
                      <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
                    </label>

                    <Field
                      type={field.type}
                      name={field.name}
                      onBlur={(e) => {
                        if (field.name === "employeeId" && e.target.value) {
                          lookupEmployee(e.target.value, setFieldValue);
                        }
                      }}
                      readOnly={field.readOnly || (field.name === "employeeId" && hasValidEmployee)}
                      style={{
                        ...styles.input,
                        ...(typeof field.style === 'function' ? field.style(field) : field.style),
                        borderColor:
                          errors[field.name] && touched[field.name]
                            ? "#dc3545"
                            : "#ced4da"
                      }}
                    />

                    {errors[field.name] && touched[field.name] && (
                      <div style={styles.errorMessage}>{errors[field.name]}</div>
                    )}
                  </div>
                ))}

                <div style={styles.buttonGroup}>
                  <button
                    type="submit"
                    style={{
                      ...styles.submitButton,
                      opacity: (isSubmitting || !hasValidEmployee) ? 0.7 : 1,
                    }}
                    disabled={isSubmitting || isLoading || !hasValidEmployee}
                  >
                    {isSubmitting ? "Submitting..." : hasValidEmployee ? "Add Salary Record" : "Enter Employee ID First"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    style={styles.cancelButton}
                    disabled={isSubmitting || isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const styles = {
  mainContent: {
    width: "calc(100vw - 250px)",
    marginTop: "70px",
    marginLeft: "250px",
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#f8f9fa",
    maxWidth: "calc(100vw - 250px)",
    overflow: "auto",
    display: "flex",
    flexDirection: "column"
  },
  formContainer: {
  width: "100%",
  maxWidth: "700px",
  margin: "0 auto"
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
  errorMessage: {
    color: "#dc3545",
    fontSize: "0.875rem",
    marginTop: "0.25rem"
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
  },
  successContainer: {
    textAlign: "center",
    padding: "2rem"
  },
  successIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 1.5rem",
    backgroundColor: "#2ecc71",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "2rem"
  },
  successTitle: {
    color: "#474747",
    fontSize: "1.5rem",
    marginBottom: "1rem"
  },
  successText: {
    color: "#8f9491",
    marginBottom: "1.5rem"
  }
};

const ValidationSchema = Yup.object().shape({
  employeeId: Yup.string()
    .required('Employee ID is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Employee ID can only contain letters, numbers and hyphens'),

  name: Yup.string()
    .required('Employee name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Name can only contain letters, spaces and simple punctuation'
    ),

  basic: Yup.number()
    .required('Basic salary is required')
    .min(10000, 'Basic salary must be at least Rs. 10,000')
    .max(500000, 'Basic salary cannot exceed Rs. 500,000'),

  additionalIncentives: Yup.number()
    .min(0, 'Incentives cannot be negative')
    .max(100000, 'Incentives cannot exceed Rs. 100,000'),

  reductions: Yup.number()
    .min(0, 'Reductions cannot be negative')
    .max(Yup.ref('basic'), 'Reductions cannot exceed basic salary')
});

export default AddSalary;