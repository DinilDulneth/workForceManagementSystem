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
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [department, setdepartment] = useState("");
  const [phone, setphone] = useState("");
  const [salary, setsalary] = useState("");
  const [dateOfJoining, setdateOfJoining] = useState("");
  const [availability, setavailability] = useState("");
  const [position, setposition] = useState("");

  function setEmployee(e) {
    e.preventDefault();
    const newEmployee = {
      name: name,
      email: email,
      password: password,
      department: department,
      phone: phone,
      salary: salary,
      dateOfJoining: dateOfJoining,
      availability: availability,
      position: position
    };
    axios
      .post(`http://localhost:8070/registration/addEmp`, newEmployee)
      .then((res) => {
        alert("Employee Registered Successfully!✅");
        setsubmitted(true);
        setname("");
        setemail("");
        setpassword("");
        setdepartment("");
        setphone("");
        setsalary("");
        setdateOfJoining("");
        setavailability("");
        setposition("");
      })
      .catch((err) => {
        alert("Error registering employee: " + err.message);
      });
    console.log(newEmployee);
  }

  return (
    <section
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                width: "100%",
                maxWidth: "900px"
              }}
              className="d-flex justify-content-between"
            >
              <div
                style={{
                  width: "50%",
                  display: "none",
                  backgroundColor: "#e6e6e6"
                }}
                className="login__img"
              >
                <img
                  src={registerImg}
                  alt="Register"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                className="login__form"
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBottom: "20px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #333"
                  }}
                  className="user"
                >
                  <img
                    src={userIcon}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>
                  Register Employee
                </h2>

                {submitted ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem 1rem"
                    }}
                    className="success-message"
                  >
                    <div
                      style={{
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
                      }}
                      className="success-icon"
                    >
                      ✓
                    </div>
                    <h3
                      style={{
                        color: "#474747",
                        fontSize: "1.5rem",
                        marginBottom: "1rem"
                      }}
                    >
                      Employee Registered
                    </h3>
                    <p style={{ color: "#8f9491", fontSize: "1rem" }}>
                      The employee has been successfully registered.
                    </p>
                  </div>
                ) : (
                  <Form onSubmit={setEmployee} style={{ width: "100%" }}>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Name"
                        required
                        id="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="email"
                        placeholder="Email"
                        required
                        id="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="password"
                        required
                        id="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Department"
                        required
                        id="department"
                        value={department}
                        onChange={(e) => setdepartment(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Phone"
                        required
                        id="phone"
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="number"
                        placeholder="Salary"
                        required
                        id="salary"
                        value={salary}
                        onChange={(e) => setsalary(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="date"
                        placeholder="Date of Joining"
                        required
                        id="dateOfJoining"
                        value={dateOfJoining}
                        onChange={(e) => setdateOfJoining(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Availability"
                        required
                        id="availability"
                        value={availability}
                        onChange={(e) => setavailability(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="position"
                        required
                        id="position"
                        value={position}
                        onChange={(e) => setposition(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem"
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#333",
                          color: "#fff",
                          padding: "12px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "background-color 0.3s"
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#555")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#333")
                        }
                        type="submit"
                      >
                        Register Employee
                      </Button>
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "#fff",
                          color: "#333",
                          padding: "12px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "background-color 0.3s"
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff")
                        }
                        type="button"
                        onClick={() => setsubmitted(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}

                <p style={{ marginTop: "15px", color: "#666" }}>
                  Already have an account?{" "}
                  <Link
                    to="/UserLogin"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
