import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  department: Yup.string().required("Department is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  dateOfJoining: Yup.date().required("Date of joining is required"),
});

export default function UpdateHR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    dateOfJoining: "",
    availability: "1"
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8070/hr/getHRByID/${id}`)
      .then((res) => {
        const hr = res.data;
        setInitialValues({
          name: hr.name || "",
          department: hr.department || "",
          email: hr.email || "",
          phone: hr.phone || "",
          dateOfJoining: hr.dateOfJoining ? new Date(hr.dateOfJoining).toISOString().split('T')[0] : "",
          availability: hr.availability || "1"
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching HR data: " + err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8070/hr/updateHR/${id}`,
        values
      );
      
      if (response.status === 200) {
        toast.success("HR officer updated successfully!");
        navigate("/HRDashboard/fetchHR");
      }
    } catch (err) {
      toast.error("Error updating HR officer: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/HRDashboard/fetchHR")}
            style={styles.button}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>
          Update HR Officer
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
                { 
                  name: "department", 
                  label: "Department", 
                  type: "select",
                  options: [
                    { value: "", label: "Select Department" },
                    { value: "IT", label: "IT" },
                    { value: "HR", label: "HR" }
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
                  {isSubmitting ? "Updating..." : "Update HR Officer"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/HRDashboard/fetchHR")}
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
    padding: "25px",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
  },
  formContainer: {
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2.5rem",
  },
  header: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "2rem",
    position: "relative",
    paddingBottom: "0.75rem",
  },
  headerUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "3px",
    backgroundColor: "#fc6625",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#2c3e50",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    transition: "border-color 0.3s ease",
    outline: "none",
    "&:focus": {
      borderColor: "#fc6625",
    },
  },
  errorMessage: {
    color: "#e74c3c",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  submitButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#fc6625",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#e55a1c",
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    color: "#2c3e50",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f8f9fa",
      borderColor: "#2c3e50",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  errorContainer: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "0.75rem 2rem",
    backgroundColor: "#fc6625",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#e55a1c",
    },
  },
};