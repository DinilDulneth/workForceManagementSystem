import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import registerImg from "../../../assets/images/3.jpg";
import userIcon from "../../../assets/images/2.jpg";

export default function EmployeeRegister() {
  const [submitted, setsubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [department, setdepartment] = useState("");
  const [phone, setphone] = useState("");
  const [salary, setsalary] = useState("");
  const [dateOfJoining, setdateOfJoining] = useState("");
  const [availability, setavailability] = useState("");
  const [position, setposition] = useState("");

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

  const formFields = [
    { type: 'text', id: 'name', placeholder: 'Name', value: name, onChange: setname },
    { type: 'email', id: 'email', placeholder: 'Email', value: email, onChange: setemail },
    { type: 'password', id: 'password', placeholder: 'Password', value: password, onChange: setpassword },
    { type: 'text', id: 'department', placeholder: 'Department', value: department, onChange: setdepartment },
    { type: 'text', id: 'phone', placeholder: 'Phone', value: phone, onChange: setphone },
    { type: 'number', id: 'salary', placeholder: 'Salary', value: salary, onChange: setsalary },
    { type: 'date', id: 'dateOfJoining', placeholder: 'Date of Joining', value: dateOfJoining, onChange: setdateOfJoining },
    { type: 'text', id: 'availability', placeholder: 'Availability', value: availability, onChange: setavailability },
    { type: 'text', id: 'position', placeholder: 'Position', value: position, onChange: setposition }
  ];

  const clearForm = () => {
    setname("");
    setemail("");
    setpassword("");
    setdepartment("");
    setphone("");
    setsalary("");
    setdateOfJoining("");
    setavailability("");
    setposition("");
  };

  async function setEmployee(e) {
    e.preventDefault();

    if (!name || !email || !password || !department || !position) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const newEmployee = {
      name,
      email,
      password,
      department,
      phone,
      salary,
      dateOfJoining,
      availability,
      position
    };

    try {
      const response = await axios.post(
        `http://localhost:8070/registration/addEmp`,
        newEmployee
      );

      if (response.status === 200 || response.status === 201) {
        try {
          const emailContent = generateEmailContent(newEmployee);
          window.location.href = `mailto:${newEmployee.email}?subject=${emailContent.subject}&body=${emailContent.body}`;
          alert("Employee Registered Successfully!✅");
          setsubmitted(true);
          clearForm();
        } catch (emailError) {
          console.error("Error generating email:", emailError);
          alert("Employee registered but there was an error sending the email.");
        }
      }
    } catch (err) {
      alert("Error registering employee: " + err.message);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
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
                
                <h2 style={styles.title}>Register Employee</h2>

                {submitted ? (
                  <div style={styles.successMessage}>
                    <div style={styles.checkmark}>✓</div>
                    <h3 style={styles.successTitle}>Employee Registered</h3>
                    <p style={styles.successText}>
                      The employee has been successfully registered and an email has been sent with their credentials.
                    </p>
                    <Button 
                      style={styles.submitButton}
                      onClick={() => setsubmitted(false)}
                    >
                      Register Another Employee
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={setEmployee} style={styles.form}>
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
                      <Button 
                        type="submit" 
                        style={styles.submitButton}
                        disabled={isLoading}
                      >
                        {isLoading ? "Registering..." : "Register Employee"}
                      </Button>
                      <Button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() => window.history.back()}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
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