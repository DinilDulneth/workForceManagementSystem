import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import registerImg from "../assets/images/3.jpg";
import userIcon from "../assets/images/2.jpg";

export default function ManagerRegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial form values
  const initialValues = {
    name: '',
    department: '',
    email: '',
    phone: '',
    password: '',
    dateOfJoining: '',
    active: true  // Default to active
  };

  // Form fields configuration
  const formFields = [
    { type: 'text', id: 'name', placeholder: 'Name' },
    { 
      type: 'select', 
      id: 'department', 
      placeholder: 'Department',
      options: [
        { value: '', label: 'Select Department' },
        { value: 'IT', label: 'IT' },
        { value: 'General Manager', label: 'General Manager' }
      ]
    },
    { type: 'email', id: 'email', placeholder: 'Email' },
    { type: 'text', id: 'phone', placeholder: 'Phone' },
    { type: 'password', id: 'password', placeholder: 'Password' },
    { type: 'date', id: 'dateOfJoining', placeholder: 'Date of Joining' },
    { 
      type: 'select', 
      id: 'active', 
      placeholder: 'Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ];

  // Email content generator
  const generateEmailContent = (managerData) => {
    const subject = "Welcome to WorkSync - Manager Account Credentials";
    const body = `
Dear ${managerData.name},

Welcome to WorkSync! We're pleased to have you join our management team.

Your login credentials are as follows:
Email: ${managerData.email}
Password: ${managerData.password}

Department: ${managerData.department}
Start Date: ${new Date(managerData.dateOfJoining).toLocaleDateString()}

Please change your password after your first login at: http://localhost:3000/login

For any questions, please contact the HR department.

Best regards,
HR Team
WorkSync`;

    return {
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body)
    };
  };

  // Form submission handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8070/manager/addManager',
        values
      );

      if (response.status === 200 || response.status === 201) {
        const emailContent = generateEmailContent(values);
        window.location.href = `mailto:${values.email}?subject=${emailContent.subject}&body=${emailContent.body}`;
        toast.success("Manager Registered Successfully!✅");
        setSubmitted(true);
        resetForm();
      }
    } catch (err) {
      toast.error("Error registering manager: " + err.message);
      console.error("Registration error:", err);
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
                
                <h2 style={styles.title}>Register Manager</h2>

                {submitted ? (
                  <div style={styles.successMessage}>
                    <div style={styles.checkmark}>✓</div>
                    <h3 style={styles.successTitle}>Manager Registered</h3>
                    <p style={styles.successText}>
                      The manager has been successfully registered.
                    </p>
                    <Button
                      style={styles.submitButton}
                      onClick={() => setSubmitted(false)}
                    >
                      Register Another Manager
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
                            {field.type === 'select' ? (
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
                                  <option key={option.value} value={option.value}>
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
                            {isLoading ? "Registering..." : "Register Manager"}
                          </Button>
                          <Button
                            type="button"
                            style={styles.cancelButton}
                            onClick={() => window.location.href='/register'}
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
    color: 'red',
    fontSize: '0.75rem',
    marginTop: '-10px',
    marginBottom: '10px',
    paddingLeft: '5px'
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
    '&.is-invalid': {
      borderColor: 'red',
      '&:focus': {
        borderColor: 'red',
        boxShadow: '0 0 0 0.2rem rgba(255, 0, 0, 0.25)'
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
    fontSize: "1rem"
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
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^(?:\+94|0)?[0-9]{9,10}$/, "Invalid phone number format. Use +94 or 0 prefix"),

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

  active: Yup.boolean()
}); 