import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import registerImg from "../../../assets/images/3.jpg";
import userIcon from "../../../assets/images/2.jpg";

export default function HRRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  function setHR(e) {
    e.preventDefault();
    const newHR = {
      name,
      department,
      email,
      phone,
      password,
      dateOfJoining,
    };
    axios
      .post(`http://localhost:8070/hrRoutes/addHR`, newHR)
      .then((res) => {
        alert("HR Registered Successfully!✅");
        setSubmitted(true);
        setName("");
        setDepartment("");
        setEmail("");
        setPhone("");
        setPassword("");
        setDateOfJoining("");
      })
      .catch((err) => {
        alert("Error registering HR: " + err.message);
      });
    console.log(newHR);
  }

  return (
    <section
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
                maxWidth: "900px",
              }}
              className="d-flex justify-content-between"
            >
              <div
                style={{
                  width: "50%",
                  display: "none",
                  backgroundColor: "#e6e6e6",
                }}
                className="login__img"
              >
                <img
                  src={registerImg}
                  alt="Register"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                  justifyContent: "center",
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
                    border: "3px solid #333",
                  }}
                  className="user"
                >
                  <img
                    src={userIcon}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>
                  Register HR
                </h2>

                {submitted ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem 1rem",
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
                        margin: "0 auto 1.5rem",
                      }}
                      className="success-icon"
                    >
                      ✓
                    </div>
                    <h3
                      style={{
                        color: "#474747",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      HR Registered
                    </h3>
                    <p style={{ color: "#8f9491", fontSize: "1rem" }}>
                      The HR has been successfully registered.
                    </p>
                  </div>
                ) : (
                  <Form onSubmit={setHR} style={{ width: "100%" }}>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Name"
                        required
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
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
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
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
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
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
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="password"
                        placeholder="Password"
                        required
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
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
                        onChange={(e) => setDateOfJoining(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "15px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          outline: "none",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#333")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </FormGroup>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem",
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
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#555")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#333")
                        }
                        type="submit"
                      >
                        Register HR
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
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff")
                        }
                        type="button"
                        onClick={() => setSubmitted(false)}
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
                      fontWeight: "bold",
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
