import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
//import * as Yup from "yup";
import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import registerImg from "../assets/images/3.jpg";
import userIcon from "../assets/images/2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function EmployeeRegisterForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Initial form values - matching exactly with your MongoDB schema
  const initialValues = {
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    dateOfJoining: "",
    availability: "1", // Default to active
    position: "",
  };

  const formFields = [
    { type: "text", id: "name", placeholder: "Full Name" },
    { type: "email", id: "email", placeholder: "Email" },
    { type: "password", id: "password", placeholder: "Password" },
    {
      type: "select",
      id: "department",
      placeholder: "Department",
      options: [
        { value: "", label: "Select Department" },
        { value: "HR", label: "HR" },
        { value: "IT", label: "IT" },
        { value: "Finance", label: "Finance" },
        { value: "Operations", label: "Operations" },
        { value: "General Employee", label: "General Employee" },
      ],
    },
    { type: "text", id: "phone", placeholder: "Phone (e.g., 0771234567)" },
    { type: "date", id: "dateOfJoining", placeholder: "Date of Joining" },
    {
      type: "select",
      id: "availability",
      placeholder: "Availability",
      options: [
        { value: "", label: "Select Availability" },
        { value: "1", label: "Active" },
        { value: "2", label: "On Leave" },
        { value: "3", label: "Inactive" },
      ],
    },
    { type: "text", id: "position", placeholder: "Position" },
  ];

  // Email content generator
  const generateEmailContent = (employeeData) => {
    const subject = "Welcome to WorkSync - Your Account Credentials";
    const body = `
Dear ${employeeData.name},

Welcome to WorkSync! We're excited to have you join our team.

Your login credentials are as follows:
Email: ${employeeData.email}
Password: ${employeeData.password}

Department: ${employeeData.department}
Position: ${employeeData.position}
Start Date: ${new Date(employeeData.dateOfJoining).toLocaleDateString()}

Please change your password after your first login at: http://localhost:3000/login

For any questions, please contact your HR department.

Best regards,
HR Team
WorkSync`;

    return {
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body),
    };
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    setServerError("");

    try {
      // For testing, bypass access check
      const hasAccess = true;

      // Format date safely
      let formattedDate;
      try {
        const dateObj = values.dateOfJoining
          ? new Date(values.dateOfJoining)
          : new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
        console.log("Formatted date:", formattedDate);
      } catch (error) {
        console.error("Date formatting error:", error);
        // Use today as fallback
        const today = new Date();
        formattedDate = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      }

      // Ensure all data is properly formatted and all required fields are present
      const formattedData = {
        name: String(values.name || "").trim(),
        position: String(values.position || "").trim(),
        department: String(values.department || "").trim(),
        email: String(values.email || "").trim(),
        password: String(values.password || ""),
        phone: String(values.phone || "").trim(),
        dateOfJoining: formattedDate,
        availability: String(values.availability || "1"),
      };

      // Verify all required fields are populated
      const requiredFields = [
        "name",
        "position",
        "department",
        "email",
        "password",
        "phone",
        "dateOfJoining",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formattedData[field] || formattedData[field] === ""
      );

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        setServerError(`Missing required fields: ${missingFields.join(", ")}`);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      // Log the exact data being sent
      console.log("API URL:", "http://localhost:8070/employee/addEmp");
      console.log(
        "Submitting employee data:",
        JSON.stringify(formattedData, null, 2)
      );

      const response = await axios.post(
        "http://localhost:8070/employee/addEmp",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      console.log("Registration success:", response.data);

      // Rest of your success handling remains the same...
    } catch (error) {
      // Enhanced error logging
      console.error("Registration error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // For debugging, let's print the full error object
      console.dir(error.response?.data, { depth: null });

      let errorMessage = "An error occurred during registration";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              error.response.data.message ||
              "Invalid registration data. Please check your inputs.";
            if (error.response.data.missingFields) {
              errorMessage +=
                " Missing fields: " +
                error.response.data.missingFields.join(", ");
            }
            break;
          // Rest of your error handling...
        }
      }

      // Rest of your error UI handling...
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <section style={styles.section}>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div style={styles.formContainer}>
              <div style={styles.imageSection}>
                <img src={registerImg} alt="Register" style={styles.image} />
              </div>

              <div style={styles.formSection}>
                <div style={styles.userIconWrapper}>
                  <img src={userIcon} alt="User" style={styles.userIcon} />
                </div>

                <h2 style={styles.title}>Register Employee</h2>

                {submitted ? (
                  <div style={styles.successMessage}>
                    <div style={styles.checkmark}>✓</div>
                    <h3 style={styles.successTitle}>Employee Registered</h3>
                    <p style={styles.successText}>
                      The employee has been successfully registered and an email
                      has been sent with their credentials.
                    </p>
                    <Button
                      style={styles.submitButton}
                      onClick={() => setSubmitted(false)}
                    >
                      Register Another Employee
                    </Button>
                  </div>
                ) : (
                  <Formik
                    initialValues={initialValues}
                    // validate={validate}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form style={styles.form}>
                        {serverError && (
                          <div style={styles.serverError}>{serverError}</div>
                        )}

                        {formFields.map((field) => (
                          <FormGroup key={field.id}>
                            {field.type === "select" ? (
                              <Field
                                as="select"
                                name={field.id}
                                className={`form-control ${
                                  errors[field.id] && touched[field.id]
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  ...styles.input,
                                  borderColor:
                                    errors[field.id] && touched[field.id]
                                      ? "red"
                                      : "#ccc",
                                }}
                              >
                                {field.options.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Field>
                            ) : (
                              <Field
                                type={field.type}
                                name={field.id}
                                placeholder={field.placeholder}
                                className={`form-control ${
                                  errors[field.id] && touched[field.id]
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{
                                  ...styles.input,
                                  borderColor:
                                    errors[field.id] && touched[field.id]
                                      ? "red"
                                      : "#ccc",
                                }}
                              />
                            )}
                            {errors[field.id] && touched[field.id] && (
                              <div style={styles.errorMessage}>
                                {errors[field.id]}
                              </div>
                            )}
                          </FormGroup>
                        ))}

                        <div style={styles.buttonGroup}>
                          <Button
                            type="submit"
                            style={styles.submitButton}
                            disabled={isLoading || isSubmitting}
                          >
                            {isLoading ? "Registering..." : "Register Employee"}
                          </Button>
                          <Button
                            type="button"
                            style={styles.cancelButton}
                            onClick={() => (window.location.href = "/register")}
                            disabled={isLoading || isSubmitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: "",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.75rem",
    marginTop: "-10px",
    marginBottom: "10px",
    paddingLeft: "5px",
  },
  serverError: {
    color: "white",
    backgroundColor: "#e74c3c",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    width: "100%",
    maxWidth: "900px",
  },
  imageSection: {
    width: "50%",
    display: "none",
    backgroundColor: "#e6e6e6",
    "@media (min-width: 768px)": {
      display: "block",
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  formSection: {
    width: "100%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  userIconWrapper: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #333",
  },
  userIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "3px solid #fc6625",
  },
  form: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
    "&.is-invalid": {
      borderColor: "red",
      "&:focus": {
        borderColor: "red",
        boxShadow: "0 0 0 0.2rem rgba(255, 0, 0, 0.25)",
      },
    },
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#555",
    },
    "&:disabled": {
      backgroundColor: "#999",
      cursor: "not-allowed",
    },
  },
  cancelButton: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#333",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&:disabled": {
      backgroundColor: "#eee",
      cursor: "not-allowed",
    },
  },
  successMessage: {
    textAlign: "center",
    padding: "2rem 1rem",
  },
  checkmark: {
    width: "70px",
    height: "70px",
    backgroundColor: "#2ecc71",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    margin: "0 auto 1.5rem",
  },
  successTitle: {
    color: "#474747",
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  successText: {
    color: "#8f9491",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
};

// Updated Validation schema with relaxed validation rules
// const ValidationSchema = Yup.object().shape({
//   name: Yup.string()
//     .required("Name is required")
//     .min(1, "Name must be at least 1 character") // Reduced minimum characters
//     .max(100, "Name cannot exceed 100 characters") // Increased maximum characters
//     .trim(),

//   email: Yup.string()
//     .required("Email is required")
//     .email("Invalid email format")
//     .trim(),

//   password: Yup.string()
//     .required("Password is required")
//     .min(4, "Password must be at least 4 characters"), // Reduced minimum password length

//   department: Yup.string().required("Department is required"),

//   phone: Yup.string()
//     .required("Phone number is required")
//     .matches(
//       /^[0-9]{9,10}$/, // Simplified phone number validation
//       "Phone number must be a valid number"
//     ),

//   dateOfJoining: Yup.date()
//     .required("Date of joining is required")
//     .max(new Date(), "Date of joining cannot be in the future"), // This rule is kept to ensure valid dates

//   availability: Yup.string()
//     .required("Availability status is required")
//     .oneOf(["1", "2", "3"], "Please select a valid availability status"),

//   position: Yup.string()
//     .required("Position is required")
//     .min(1, "Position must be at least 1 character") // Reduced minimum characters
//     .max(100, "Position cannot exceed 100 characters"), // Increased maximum characters
// });
