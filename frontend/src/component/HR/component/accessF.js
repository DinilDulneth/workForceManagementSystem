import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";

// Add email generation function
const generateEmailContent = (userData) => {
  const subject = "Welcome to WorkSync - Your Access Credentials";
  const body = `
Dear ${userData.name},

Welcome to WorkSync! Your account has been successfully created.

Your login credentials are:
Email: ${userData.email}
Password: ${userData.password}

Role Details:
Department: ${userData.department}
Role Type: ${
    userData.status === "1"
      ? "Employee"
      : userData.status === "2"
      ? "Manager"
      : "HR"
  }

Please login at: http://localhost:3000/login
For security reasons, please change your password after your first login.

If you have any questions, please contact the HR department.

Best regards,
HR Team
WorkSync`;

  return {
    subject: encodeURIComponent(subject),
    body: encodeURIComponent(body)
  };
};

export default function AccessF() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    department: "",
    salary: "",
    status: ""
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    console.log("Form values:", values);
    console.log("hello...");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8070/access/addAccess",
        values
      );

      if (response.status === 201) {
        // Generate and trigger email
        const emailContent = generateEmailContent(values);
        window.location.href = `mailto:${values.email}?subject=${emailContent.subject}&body=${emailContent.body}`;

        Swal("Success!", "Access granted successfully!", "success");
        setSubmitted(true);
        resetForm();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to grant access. Please try again.",
        confirmButtonText: "OK"
      });
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const formFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "department", label: "Department", type: "text" },
    { name: "salary", label: "Salary", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "1", label: "employee" },
        { value: "2", label: "manager" },
        { value: "3", label: "hr" }
      ]
    }
  ];

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        {submitted ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Access Granted</h3>
            <p style={styles.successText}>
              The access details have been successfully added.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={styles.submitButton}
            >
              Add Another Access
            </button>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <h2 style={styles.header}>
                  Grant Access
                  <span style={styles.headerUnderline}></span>
                </h2>

                {formFields.map((field) => (
                  <div key={field.name} style={styles.formGroup}>
                    <label htmlFor={field.name} style={styles.label}>
                      {field.label}:
                      <span style={{ color: "#fc6625", marginLeft: "4px" }}>
                        *
                      </span>
                    </label>

                    {field.type === "select" ? (
                      <Field as="select" name={field.name} style={styles.input}>
                        <option value="">Select Status</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    ) : (
                      <Field
                        type={field.type}
                        name={field.name}
                        style={{
                          ...styles.input,
                          borderColor:
                            errors[field.name] && touched[field.name]
                              ? "#dc3545"
                              : "#ced4da"
                        }}
                      />
                    )}

                    {errors[field.name] && touched[field.name] && (
                      <div style={styles.errorMessage}>
                        {errors[field.name]}
                      </div>
                    )}
                  </div>
                ))}

                <div style={styles.buttonGroup}>
                  <button
                    type="submit"
                    style={{
                      ...styles.submitButton,
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Submitting..." : "Grant Access"}
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
}

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
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2.5rem",
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
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      "Name can only contain letters, spaces and simple punctuation"
    ),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least one letter and one number"
    ),

  department: Yup.string()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters"),

  salary: Yup.string()
    .required("Salary is required")
    .matches(/^\d+$/, "Salary must be a number")
    .test(
      "salary-range",
      "Salary must be between 10000 and 500000",
      (value) => value && parseInt(value) >= 10000 && parseInt(value) <= 500000
    ),

  status: Yup.string()
    .required("Status is required")
    .oneOf(["1", "2", "3"], "Status must be 1, 2, or 3")
});
