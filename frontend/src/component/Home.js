import React from "react";
import happy from "../assets/images/1.jpg";
import happy1 from "../assets/images/2.jpg";
import happy2 from "../assets/images/3.jpg";
import happy3 from "../assets/images/4.jpg";
import happy4 from "../assets/images/5.jpg";
import { Container, Row, Col } from "reactstrap";
import StatsRow from "../component/StatsRow.js";
import ImageSlider from "../component/ImageSlider.js";
import Header from "./Header/Header.js";
import Footer from "./Footer/Footer.js";

export default function Home() {
  return (
    <>
      <Header />
      <ImageSlider />
      {/* Home Section */}
      <section
        style={{
          padding: "40px 0",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Container>
          <Row className="align-items-center" style={{flexDirection: "row"}}>
            {/* Text Section */}
            <Col lg="6" style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#333", textAlign: "left" }}>
              <p style={{ fontSize: "2.5rem" }}>
                <span style={{ fontSize: "2.5rem", color: "#ff3c00" }}>Lets boost </span>your business with our services....
              </p>
            </Col>

            {/* Image Section */}
            <Col lg="6" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <img
                src={happy}
                alt="Happy"
                style={{
                  width: "300px",
                  height: "auto",
                  marginRight: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <img
                src={happy1}
                alt="Happy"
                style={{
                  width: "300px",
                  height: "auto",
                  marginRight: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <img
                src={happy2}
                alt="Happy"
                style={{
                  width: "300px",
                  height: "auto",
                  marginRight: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <img
                src={happy3}
                alt="Happy"
                style={{
                  width: "300px",
                  height: "auto",
                  marginRight: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <img
                src={happy4}
                alt="Happy"
                style={{
                  width: "300px",
                  height: "auto",
                  marginRight: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* StatsRow Component */}
      <StatsRow />

      <Footer />
    </>
  );
}