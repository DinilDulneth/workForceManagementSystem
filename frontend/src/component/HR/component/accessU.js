import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  position: Yup.string().required("Position is required"),
  department: Yup.string().required("Department is required"),
  salary: Yup.string()
    .required("Salary is required")
    .matches(/^\d+$/, "Salary must be a number"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["1", "2", "3"], "Invalid status value")
});

export default function AccessUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    status: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8070/access/getAccessByID/${id}`)
      .then((res) => {
        setInitialValues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching access record");
        setLoading(false);
        console.error("Error:", err);
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8070/access/updateAccess/${id}`,
        values
      );
      if (response.status === 200) {
        Swal.fire("Access record updated successfully!");
        navigate("/HRDashboard/");
      }
    } catch (err) {
      Swal.fire("Error updating record: " + err.message);
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
        <button onClick={() => navigate("/HRDashboard/")} style={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>
          Update Access
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
                { name: "email", label: "Email", type: "email" },
                { name: "position", label: "Position", type: "text" },
                { name: "department", label: "Department", type: "text" },
                { name: "salary", label: "Salary", type: "text" },
                {
                  name: "status",
                  label: "Status",
                  type: "select",
                  options: [
                    { value: "1", label: "Active" },
                    { value: "2", label: "On Leave" },
                    { value: "3", label: "Inactive" }
                  ]
                }
              ].map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label htmlFor={field.name} style={styles.label}>
                    {field.label}
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
                  {isSubmitting ? "Updating..." : "Update Access"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/HRDashboard/")}
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
    justifyContent: "center"
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
    transition: "border-color 0.2s ease-in-out"
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
    transition: "background-color 0.2s ease"
  },
  cancelButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "white",
    color: "#6c757d",
    border: "1px solid #6c757d",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
  errorContainer: {
    textAlign: "center",
    padding: "2rem",
    color: "#dc3545"
  }
};
