import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, FormGroup, Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import registerImg from "../../../assets/images/3.jpg";
import userIcon from "../../../assets/images/2.jpg";
import logo from "../../../assets/images/logo1.png";



export default function ManagerRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");



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
WorkSync
`;

    return {
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body)
    };
  };

  const formFields = [
    { type: 'text', id: 'name', placeholder: 'Name', value: name, onChange: setName },
    { type: 'text', id: 'department', placeholder: 'Department', value: department, onChange: setDepartment },
    { type: 'email', id: 'email', placeholder: 'Email', value: email, onChange: setEmail },
    { type: 'text', id: 'phone', placeholder: 'Phone', value: phone, onChange: setPhone },
    { type: 'password', id: 'password', placeholder: 'Password', value: password, onChange: setPassword },
    { type: 'date', id: 'dateOfJoining', placeholder: 'Date of Joining', value: dateOfJoining, onChange: setDateOfJoining }
  ];

  function setManager(e) {
    e.preventDefault();
    const newManager = {
      name,
      department,
      email,
      phone,
      password,
      dateOfJoining,
    };
    axios
      .post(`http://localhost:8070/manager/addManager`, newManager)
      .then((res) => {

        const emailContent = generateEmailContent(newManager);
        window.location.href = `mailto:${newManager.email}?subject=${emailContent.subject}&body=${emailContent.body}`;
        
        alert("Manager Registered Successfully!✅");
        setSubmitted(true);
        setName("");
        setDepartment("");
        setEmail("");
        setPhone("");
        setPassword("");
        setDateOfJoining("");
      })
      .catch((err) => {
        alert("Error registering manager: " + err.message);
      });
  }

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
                
                <h2 style={styles.title}>Register Manager</h2>

                {submitted ? (
                  <div style={styles.successMessage}>
                    <div style={styles.checkmark}>✓</div>
                    <h3 style={styles.successTitle}>Manager Registered</h3>
                    <p style={styles.successText}>
                      The manager has been successfully registered.
                    </p>
                  </div>
                ) : (
                  <Form onSubmit={setManager} style={styles.form}>
                    {formFields.map((field) => (
                      <FormGroup key={field.id}>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          required
                          id={field.id}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={styles.input}
                          onFocus={(e) => e.target.style.borderColor = "#333"}
                          onBlur={(e) => e.target.style.borderColor = "#ccc"}
                        />
                      </FormGroup>
                    ))}

                    <div style={styles.buttonGroup}>
                      <Button type="submit" style={styles.submitButton}>
                        Register Manager
                      </Button>
                      <Button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() => setSubmitted(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}

                {/* <p style={styles.loginPrompt}>
                  Already have an account?{" "}
                  <Link to="/UserLogin" style={styles.loginLink}>
                    Login
                  </Link>
                </p> */}
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
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
    transition: "border-color 0.3s"
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
  },
  loginPrompt: {
    marginTop: "15px",
    color: "#666"
  },
  loginLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold"
  }
};