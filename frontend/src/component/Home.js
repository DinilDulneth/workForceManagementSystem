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
import Chatbot from "../chatbot/Chatbot.js";

export default function Home() {
  return (
    <div style={styles.mainContainer}>
      <Header />
      <ImageSlider />
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <Container>
          <Row className="align-items-center">
            {/* Text Content */}
            <Col lg="6">
              <div style={styles.heroContent}>
                <h1 style={styles.heroTitle}>
                  <span style={styles.highlight}>Let's boost</span> your business with our services
                </h1>
                <p style={styles.heroText}>
                  Transform your workforce management with our comprehensive solutions designed for modern businesses.
                </p>
              </div>
            </Col>

            {/* Image Gallery */}
            <Col lg="6">
              <div style={styles.imageGallery}>
                {[happy, happy1, happy2, happy3, happy4].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery image ${index + 1}`}
                    style={styles.galleryImage}
                    className="gallery-image"
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <StatsRow />
      </section>
      <Chatbot />
      <Footer />
    </div>
  );
}

const styles = {
  mainContainer: {
    
    minHeight: "100vh"
  },
  heroSection: {
    padding: "80px 0",
  
  },
  heroContent: {
    paddingRight: "40px"
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "25px",
    color: "#2d3436"
  },
  highlight: {
    color: "#ff7043",
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      bottom: "-5px",
      left: "0",
      width: "100%",
      height: "3px",
      backgroundColor: "#ff7043",
      opacity: "0.3"
    }
  },
  heroText: {
    fontSize: "1.25rem",
    lineHeight: "1.8",
    color: "#636e72",
    marginBottom: "30px"
  },
  imageGallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px"
  },
  galleryImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
    }
  },
  statsSection: {
    padding: "60px 0",
    backgroundColor: "#f8f9fa"
  }
};

// Add this CSS to your stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .gallery-image:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(styleSheet);