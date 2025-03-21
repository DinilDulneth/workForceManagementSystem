import React from "react";
import logo from "../../assets/images/logo1.png";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f5f5f5",
        padding: "40px 0",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          padding: "20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Logo and Description */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <img
            src={logo}
            alt="Travel World Logo"
            style={{ width: "150px", marginBottom: "10px" }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              marginTop: "10px",
              lineHeight: "1.6",
            }}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt
            nam iusto sapiente et totam! Expedita sequi ipsum, obcaecati rem qui
            cupiditate modi doloremque doloribus nihil praesentium facilis
            deleniti nesciunt corporis cum.
          </p>
        </div>

        {/* Discover */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <h5
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#222",
            }}
          >
            Discover
          </h5>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                Home
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                About
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                Tours
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <h5
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#222",
            }}
          >
            Quick Links
          </h5>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                Gallery
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                Login
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  transition: "color 0.3s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff9800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
              >
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div style={{ flex: 1, minWidth: "150px" }}>
          <h5
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#222",
            }}
          >
            Contact
          </h5>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li
              style={{
                fontSize: "0.95rem",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#222" }}>Address:</strong> Sylhet,
              Bangladesh
            </li>
            <li
              style={{
                fontSize: "0.95rem",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#222" }}>E-mail:</strong> ravi@gmail.com
            </li>
            <li
              style={{
                fontSize: "0.95rem",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#222" }}>Phone:</strong> +02324123123
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "0.9rem",
          color: "#777",
          textAlign: "center",
        }}
      >
        &copy; {new Date().getFullYear()}, Design and developer by RavyS. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;