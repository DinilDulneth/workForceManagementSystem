import React from "react";
import { FaUsers, FaClock, FaChartLine, FaShieldAlt, FaComments, FaCog } from "react-icons/fa";
import Header from "./Header/Header.js";
import Footer from "./Footer/Footer.js";

export default function About() {
  return (
   <>
    <Header />
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.mainTitle}>Welcome to WorkSync</h1>
          <p style={styles.subtitle}>
            Empowering Organizations Through Smart Workforce Management
          </p>
        </section>

        {/* Mission Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.text}>
            At WorkSync, we're dedicated to revolutionizing workforce management
            through innovative technology solutions. Our comprehensive platform
            helps organizations streamline their operations, enhance productivity,
            and create a better working environment for all employees.
          </p>
        </section>

        {/* Features Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What We Offer</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.iconContainer}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureText}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose WorkSync?</h2>
          <div style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <div key={index} style={styles.benefitItem}>
                <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                <p style={styles.text}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Get In Touch</h2>
          <div style={styles.contactCard}>
            <p style={styles.contactText}>
              Have questions about how WorkSync can help your organization?
              We'd love to hear from you!
            </p>
</div>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
  
}

// Content Data
const features = [
  {
    icon: <FaUsers size={24} color="#ff7043" />,
    title: "Employee Management",
    description: "Comprehensive tools for managing employee records, attendance, and performance."
  },
  {
    icon: <FaClock size={24} color="#ff7043" />,
    title: "Time Tracking",
    description: "Efficient time tracking and leave management system for better workforce planning."
  },
  {
    icon: <FaChartLine size={24} color="#ff7043" />,
    title: "Performance Analytics",
    description: "Detailed insights and analytics to monitor and improve workforce productivity."
  },
  {
    icon: <FaShieldAlt size={24} color="#ff7043" />,
    title: "Compliance & Security",
    description: "Ensure data security and compliance with industry regulations."
  },
  {
    icon: <FaComments size={24} color="#ff7043" />,
    title: "Communication Tools",
    description: "Enhanced communication features for better team collaboration."
  },
  {
    icon: <FaCog size={24} color="#ff7043" />,
    title: "Custom Solutions",
    description: "Tailored solutions to meet your organization's specific needs."
  }
];

const benefits = [
  {
    title: "Streamlined Operations",
    description: "Automate routine tasks and reduce administrative burden with our intuitive platform."
  },
  {
    title: "Data-Driven Decisions",
    description: "Access real-time analytics and reports to make informed business decisions."
  },
  {
    title: "Enhanced Productivity",
    description: "Improve workforce efficiency with better resource management and planning."
  },
  {
    title: "Cost-Effective",
    description: "Reduce operational costs while maximizing workforce productivity and satisfaction."
  }
];

// Styles
const styles = {
  pageContainer: {
    marginTop: "60px", // Only keep navbar spacing
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 60px)",
    width: "100%" // Full width
  },
  container: {
    maxWidth: "1400px", // Increased from 1200px for fuller width
    margin: "0 auto",
    padding: "40px 20px"
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "60px",
    padding: "60px 0", // Increased padding
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  mainTitle: {
    fontSize: "42px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px"
  },
  subtitle: {
    fontSize: "20px",
    color: "#666",
    maxWidth: "800px",
    margin: "0 auto"
  },
  section: {
    marginBottom: "60px"
  },
  sectionTitle: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center"
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#555"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", // Increased from 300px
    gap: "30px",
    margin: "40px 0"
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)"
    }
  },
  iconContainer: {
    marginBottom: "20px"
  },
  featureTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "15px"
  },
  featureText: {
    fontSize: "16px",
    color: "#666"
  },
  benefitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Increased from 250px
    gap: "30px"
  },
  benefitItem: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  benefitTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "15px"
  },
  contactSection: {
    textAlign: "center"
  },
  contactCard: {
    backgroundColor: "#fff",
    padding: "60px", // Increased padding
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "1000px", // Increased from 800px
    margin: "0 auto"
  },
  contactText: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px"
  },
  contactDetails: {
    fontSize: "16px",
    color: "#666",
    "& p": {
      margin: "10px 0"
    }
  }
};