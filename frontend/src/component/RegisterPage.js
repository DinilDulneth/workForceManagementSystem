import React from "react";
import { Link } from "react-router-dom";
import loginV from "../assets/videos/loginV.mp4";

const RegisterPage = () => {
  return (
    <div style={styles.authWrapper}>
      <video autoPlay loop muted playsInline style={styles.videoBackground}>
        <source src={loginV} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.authGlassCard}>
        <h2 style={styles.header}>Choose Registration Type</h2>
        <div style={styles.registrationButtons}>
          <Link to="/employee-register" style={styles.registerButton}>
            Register Employee
          </Link>
          <Link to="/hr-register" style={styles.registerButton}>
            Register HR
          </Link>
          <Link to="/manager-register" style={styles.registerButton}>
            Register Manager
          </Link>
        </div>
        <div style={styles.backToHome}>
          <p style={styles.backToHomeText}>
            <Link to="/UserLogin" style={styles.backLink}>
              Back
            </Link>
            {" | "}
            <Link to="/" style={styles.homeLink}>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    zIndex: 1,
  },
  header: {
    color: "#333",
    marginBottom: "20px",
  },
  registrationButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
    width: "100%"
  },
  registerButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    textDecoration: "none",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#555",
    }
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
  backLink: {
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

export default RegisterPage; 