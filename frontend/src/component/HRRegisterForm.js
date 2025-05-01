import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import registerImg from "../assets/images/3.jpg";
import userIcon from "../assets/images/2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function HRRegisterForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial form values
  const initialValues = {
    name: "",
    department: "",
    email: "",
    phone: "",
    password: "",
    dateOfJoining: "",
    availability: "1" // Default to active
  };

  // Form fields configuration
  const formFields = [
    { type: "text", id: "name", placeholder: "Name" },
    {
      type: "select",
      id: "department",
      placeholder: "Department",
      options: [
        { value: "", label: "Select Department" },
        { value: "IT", label: "IT" },
        { value: "HR", label: "HR" }
      ]
    },
    { type: "email", id: "email", placeholder: "Email" },
    { type: "text", id: "phone", placeholder: "Phone" },
    { type: "password", id: "password", placeholder: "Password" },
    { type: "date", id: "dateOfJoining", placeholder: "Date of Joining" },
    {
      type: "select",
      id: "availability",
      placeholder: "Status",
      options: [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" }
      ]
    }
  ];

  // Email content generator
  const generateEmailContent = (hrData) => {
    const subject = "Welcome to WorkSync - HR Account Credentials";
    const body = `
Dear ${hrData.name},

Welcome to WorkSync! We're pleased to have you join our HR team.

Your login credentials are as follows:
Email: ${hrData.email}
Password: ${hrData.password}

Department: ${hrData.department}
Start Date: ${new Date(hrData.dateOfJoining).toLocaleDateString()}

Please change your password after your first login at: http://localhost:3000/login

For any questions, please contact the System Administrator.

Best regards,
Admin Team
WorkSync`;

    return {
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body)
    };
  };

  // Function to check email access
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

  // Form submission handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    try {
      // Check email access first
      const hasAccess = await checkEmailAccess(values.email);

      if (!hasAccess) {
        Swal(
          "You don't have permission to register. Please contact administrator.",
          "error"
        );
        setTimeout(() => {
          navigate("/");
        }, 3000);
        return;
      }

      // If email has access, proceed with registration
      const response = await axios.post(
        "http://localhost:8070/hr/addHR",
        values
      );

      if (response.status === 201 || response.status === 200) {
        const emailContent = generateEmailContent(values);
        window.location.href = `mailto:${values.email}?subject=${emailContent.subject}&body=${emailContent.body}`;
        Swal("Success!", "Registered successfully! Please login", "success");
        setSubmitted(true);
        resetForm();

        setTimeout(() => {
          navigate("/UserLogin");
        }, 3000);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Email access denied. Registration failed.");
      } else {
        toast.error("Error registering HR: " + error.message);
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <section style={styles.section}>
      <ToastContainer position="top-right" autoClose={3000} />
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

                <h2 style={styles.title}>Register HR</h2>

                {submitted ? (
                  <div style={styles.successMessage}>
                    <div style={styles.checkmark}>✓</div>
                    <h3 style={styles.successTitle}>HR Registered</h3>
                    <p style={styles.successText}>
                      The HR has been successfully registered and an email has
                      been sent with their credentials.
                    </p>
                    <Button
                      style={styles.submitButton}
                      onClick={() => setSubmitted(false)}
                    >
                      Register Another HR
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
                            {isLoading ? "Registering..." : "Register HR"}
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
    backgroundColor: "#e6e6e6"
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

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  department: Yup.string()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format"
    ),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^(?:\+94|0)?[0-9]{9,10}$/,
      "Invalid phone number format. Use +94 or 0 prefix"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  dateOfJoining: Yup.date()
    .required("Date of joining is required")
    .max(new Date(), "Date cannot be in the future")
    .min(new Date(2000, 0, 1), "Date cannot be before year 2000"),

  availability: Yup.string()
    .required("Status is required")
    .oneOf(["0", "1"], "Invalid status value")
});
