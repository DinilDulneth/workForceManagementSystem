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
import "../../styles/login.css";

import registerImg from "../../assets/images/3.jpg";
import userIcon from "../../assets/images/2.jpg";

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
      position: position,
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
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="Register" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="User" />
                </div>
                <h2>Register Employee</h2>

                {submitted ? (
                  <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h3>Employee Registered</h3>
                    <p>The employee has been successfully registered.</p>
                  </div>
                ) : (
                  <Form onSubmit={setEmployee}>
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Name"
                        required
                        id="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
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
                      />
                    </FormGroup>

                    <div className="form-actions">
                      <Button
                        className="btn secondary__btn auth__btn"
                        type="submit"
                      >
                        Register Employee
                      </Button>
                      <Button type="button" onClick={() => setsubmitted(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}

                <p>
                  Already have an account? <Link to="/UserLogin">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
