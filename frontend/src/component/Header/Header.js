import React from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo1.png";

const nav_links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/employeeResignation",
    display: "employeeResignation",
  },
];

const Header = () => {
  return (
    <header
      style={{
        width: "100%",
        background: "#fff",
        padding: "15px 30px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container>
        <Row>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* logo*/}
            <img
              src={logo}
              alt=""
              style={{
                maxWidth: "140px",
              }}
            />
            {/* logo end*/}

            {/* menu start*/}
            <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "30px",
                  margin: 0,
                  padding: 0,
                }}
              >
                {nav_links.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      style={({ isActive }) => ({
                        textDecoration: "none",
                        color: isActive ? "#ff6600" : "#333",
                        fontSize: "16px",
                        fontWeight: isActive ? "bold" : "500",
                        transition: "color 0.3s ease-in-out",
                      })}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* menu end*/}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <Button
                  style={{
                    border: "none",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    background: "#f0f0f0",
                    color: "#333",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#ddd")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#f0f0f0")
                  }
                >
                  <Link to="/UserLogin" style={{ color: "#333" }}>
                    Login
                  </Link>
                </Button>

                <Button
                  style={{
                    border: "none",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    background: "#ff6600",
                    color: "white",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#e55a00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#ff6600")
                  }
                >
                  <Link to="/Register" style={{ color: "white" }}>
                    Register
                  </Link>
                </Button>
              </div>
              <span
                style={{
                  display: "none",
                }}
              >
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
