import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import registerImg from "../assets/images/3.jpg";
import userIcon from "../assets/images/2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    position: ""
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
        { value: "General Employee", label: "General Employee" }
      ]
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
        { value: "3", label: "Inactive" }
      ]
    },
    { type: "text", id: "position", placeholder: "Position" }
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
      body: encodeURIComponent(body)
    };
  };

  // Add this function to check email access
  const checkEmailAccess = async (email) => {
    try {
      const response = await axios.get(
        "http://localhost:8070/access/getAccess"
      );
      const accessList = response.data;
      return accessList.some(
        (access) => access.email === email && access.status === "1"
      );
    } catch (error) {
      console.error("Error checking email access:", error);
      throw error;
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    setServerError("");

    try {
      // Check email access first
      const hasAccess = await checkEmailAccess(values.email);

      if (!hasAccess) {
        await Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You do not have permission to register. Please contact HR department.",
          confirmButtonColor: "#d33",
          allowOutsideClick: false
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);

        return;
      }

      // Format the data to match backend expectations
      const formattedData = {
        ...values,
        dateOfJoining:
          values.dateOfJoining instanceof Date
            ? values.dateOfJoining.toISOString().split("T")[0]
            : values.dateOfJoining
      };

      const response = await axios.post(
        "http://localhost:8070/employee/addEmp",
        formattedData
      );

      if (response.status === 201 || response.status === 200) {
        const emailContent = generateEmailContent(values);
        window.location.href = `mailto:${values.email}?subject=${emailContent.subject}&body=${emailContent.body}`;

        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Employee has been registered successfully! Redirecting to login...",
          confirmButtonColor: "#28a745",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        setSubmitted(true);
        resetForm();

        // Navigate to login page after 3 seconds
        setTimeout(() => {
          navigate("/UserLogin");
        }, 3000);
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "An error occurred during registration";

      if (error.response) {
        // Handle specific error responses from the server
        switch (error.response.status) {
          case 400:
            errorMessage =
              "Invalid registration data. Please check your inputs.";
            break;
          case 409:
            errorMessage =
              "Email already exists. Please use a different email.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
        showCancelButton: true,
        cancelButtonText: "Go Back",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isDismissed) {
          navigate("/");
        }
      });

      setServerError(errorMessage);
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
                    validationSchema={ValidationSchema}
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
                                      : "#ccc"
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
                                      : "#ccc"
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
    justifyContent: "center"
  },
  errorMessage: {
    color: "red",
    fontSize: "0.75rem",
    marginTop: "-10px",
    marginBottom: "10px",
    paddingLeft: "5px"
  },
  serverError: {
    color: "white",
    backgroundColor: "#e74c3c",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center"
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    width: "100%",
    maxWidth: "900px"
  },
  imageSection: {
    width: "50%",
    display: "none",
    backgroundColor: "#e6e6e6",
    "@media (min-width: 768px)": {
      display: "block"
    }
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  formSection: {
    width: "100%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  userIconWrapper: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #333"
  },
  userIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "3px solid #fc6625"
  },
  form: {
    width: "100%"
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
        boxShadow: "0 0 0 0.2rem rgba(255, 0, 0, 0.25)"
      }
    }
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem"
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
      backgroundColor: "#555"
    },
    "&:disabled": {
      backgroundColor: "#999",
      cursor: "not-allowed"
    }
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
      backgroundColor: "#f5f5f5"
    },
    "&:disabled": {
      backgroundColor: "#eee",
      cursor: "not-allowed"
    }
  },
  successMessage: {
    textAlign: "center",
    padding: "2rem 1rem"
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
    margin: "0 auto 1.5rem"
  },
  successTitle: {
    color: "#474747",
    fontSize: "1.5rem",
    marginBottom: "1rem"
  },
  successText: {
    color: "#8f9491",
    fontSize: "1rem",
    marginBottom: "1.5rem"
  }
};

// Validation schema simplified to match exactly with your MongoDB model
const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .trim(),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  department: Yup.string().required("Department is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(?:\+94|0)?[0-9]{9,10}$/,
      "Phone number must be a valid Sri Lankan number"
    ),

  dateOfJoining: Yup.date()
    .required("Date of joining is required")
    .max(new Date(), "Date of joining cannot be in the future"),

  availability: Yup.string()
    .required("Availability status is required")
    .oneOf(["1", "2", "3"], "Please select a valid availability status"),

  position: Yup.string()
    .required("Position is required")
    .min(2, "Position must be at least 2 characters")
    .max(50, "Position cannot exceed 50 characters")
});
