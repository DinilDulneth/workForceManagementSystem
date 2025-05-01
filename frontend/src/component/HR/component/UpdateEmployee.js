import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  position: Yup.string()
    .required("Position is required")
    .min(2, "Position must be at least 2 characters"),

  department: Yup.string()
    .required("Department is required"),

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

  dateOfJoining: Yup.date()
    .required("Date of joining is required")
    .max(new Date(), "Date cannot be in the future")
    .min(new Date(2000, 0, 1), "Date cannot be before year 2000"),

  availability: Yup.string()
    .required("Status is required")
    .oneOf(["0", "1"], "Invalid status value")
});

export default function UpdateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    dateOfJoining: "",
    availability: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8070/employee/getEmpByID/${id}`)
      .then((res) => {
        setInitialValues({
          name: res.data.name || "",
          position: res.data.position || "",
          department: res.data.department || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          dateOfJoining: res.data.dateOfJoining ? res.data.dateOfJoining.split('T')[0] : "",
          availability: res.data.availability || "1"
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching employee details");
        setLoading(false);
        console.error("Error:", err);
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        `http://localhost:8070/employee/updateEmp/${id}`,
        values
      );
      if (response.status === 200) {
        toast.success("Employee details updated successfully!");
        setTimeout(() => {
          navigate("/HRDashboard/fetchEmp");
        }, 2000);
      }
    } catch (err) {
      toast.error("Error updating employee: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>Error</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate("/HRDashboard/fetchEmp")}
          style={styles.button}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.formContainer}>
        <h2 style={styles.header}>
          Update Employee
          <span style={styles.headerUnderline}></span>
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "position", label: "Position", type: "text" },
                { 
                  name: "department", 
                  label: "Department", 
                  type: "select",
                  options: [
                    { value: "", label: "Select Department" },
                    { value: "IT", label: "IT" },
                    { value: "HR", label: "HR" },
                    { value: "Finance", label: "Finance" },
                    { value: "Marketing", label: "Marketing" }
                  ]
                },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone", type: "text" },
                { name: "dateOfJoining", label: "Date of Joining", type: "date" },
                { 
                  name: "availability", 
                  label: "Status", 
                  type: "select",
                  options: [
                    { value: "1", label: "Active" },
                    { value: "0", label: "Inactive" }
                  ]
                }
              ].map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label htmlFor={field.name} style={styles.label}>
                    {field.label}
                    <span style={{ color: "#fc6625", marginLeft: "4px" }}>*</span>
                  </label>

                  {field.type === "select" ? (
                    <Field as="select" name={field.name} style={styles.input}>
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
                      style={styles.input}
                    />
                  )}

                  {errors[field.name] && touched[field.name] && (
                    <div style={styles.errorMessage}>{errors[field.name]}</div>
                  )}
                </div>
              ))}

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Employee"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/HRDashboard/fetchEmp")}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

const styles = {
  mainContent: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "calc(100vh - 70px)"
  },
  formContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
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
    color: "#474747",
    marginBottom: "0.5rem",
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #8f9491",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#474747",
    transition: "border-color 0.3s ease"
  },
  errorMessage: {
    color: "#e74c3c",
    fontSize: "0.8rem",
    marginTop: "0.25rem"
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem"
  },
  submitButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#fc6625",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#e55a1c"
    }
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#474747",
    border: "1px solid #8f9491",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 70px)",
    marginLeft: "250px"
  },
  errorContainer: {
    marginLeft: "250px",
    marginTop: "70px",
    padding: "2rem",
    textAlign: "center"
  }
};