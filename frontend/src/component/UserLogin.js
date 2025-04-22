import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import loginV from "../assets/videos/loginV.mp4";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8070/api/auth/login",
        { email, password }
      );
      // Store necessary information in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);

      if (data.name) {
        localStorage.setItem("name", data.name);
      }

      switch (data.role) {
        case "HR":
          await getHrID(email);
          navigate("/HRDashboard");
          break;

        case "Manager":
          await getManagerID(email);
          navigate("/ManagerDashboard");
          break;

        case "Employee":
          await getEmployeeID(email);
          navigate("/EmployeeDashboard");
          break;

        default:
          break;
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login failed", error);
    }
  };

  const getHrID = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8070/hr/getHRByEmail/${email}`
      );
      localStorage.setItem("ID", res.data._id);
      localStorage.setItem("Name", res.data.name);
    } catch (err) {
      console.error("Error fetching HR:", err);
    }
  };

  const getManagerID = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8070/manager/getManagerByEmail/${email}`
      );
      localStorage.setItem("ID", res.data._id);
      localStorage.setItem("Name", res.data.name);
    } catch (err) {
      console.error("Error fetching manager:", err);
    }
  };

  const getEmployeeID = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8070/employee/getEmployeeByEmail/${email}`
      );
      localStorage.setItem("ID", res.data._id);
      localStorage.setItem("Name", res.data.name);
    } catch (err) {
      console.error("Error fetching Employee:", err);
    }
  };

  return (
    <div style={styles.authWrapper}>
      <video autoPlay loop muted playsInline style={styles.videoBackground}>
        <source src={loginV} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.authGlassCard}>
        <h2 style={styles.header}>Welcome to WorkSync</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Email Address"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <FontAwesomeIcon icon={faLock} style={styles.icon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
          <div style={styles.backToHome}>
            <p style={styles.backToHomeText}>
              Back to{" "}
              <Link
                to="/"
                style={styles.homeLink}
              >
                Home
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {


  authWrapper: {
    position: "relative", // Add this
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    fontFamily: "Arial, sans-serif",
    overflow: "hidden", // Add this
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
  },
  authGlassCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Make it slightly transparent
    backdropFilter: "blur(10px)", // Add blur effect
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: 1, // Ensure it's above the video
  },
  header: {
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    position: "relative",
    marginBottom: "15px",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    color: "#007bff",
  },
  input: {
    width: "100%",
    padding: "10px 10px 10px 40px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#ff5722",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#e64a19",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },

  backToHome: {
    marginTop: "20px",
    textAlign: "center",
    padding: "10px",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  },
  backToHomeText: {
    color: "#666",
    fontSize: "0.9rem",
    margin: 0,
  },
  homeLink: {
    color: "#ff5722",
    textDecoration: "none",
    fontWeight: "600",
    position: "relative",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#e64a19",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "2px",
      bottom: -2,
      left: 0,
      backgroundColor: "#ff5722",
      transform: "scaleX(0)",
      transition: "transform 0.3s ease",
    },
    "&:hover::after": {
      transform: "scaleX(1)",
    },
  },
};

export default UserLogin;
