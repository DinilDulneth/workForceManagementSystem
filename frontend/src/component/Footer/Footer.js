import React from "react";
import "./footer.css";
import logo from "../../assets/images/logo1.png";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section__logo">
          <img src={logo} alt="Travel World Logo" className="footer-logo" />
          <p className="footer-description">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt nam iusto
            sapiente et totam! Expedita sequi ipsum, obcaecati rem qui cupiditate modi
            doloremque doloribus nihil praesentium facilis deleniti nesciunt corporis cum.
          </p>
        </div>

        {/* Discover */}
        <div className="footer-section__links">
          <h5>Discover</h5>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Tours</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section__links">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">Login</a></li>
            <li><a href="#">Register</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section__contact">
          <h5>Contact</h5>
          <ul>
            <li><strong>Address:</strong> Sylhet, Bangladesh</li>
            <li><strong>E-mail:</strong> ravi@gmail.com</li>
            <li><strong>Phone:</strong> +02324123123</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()}, Design and developer by RavyS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;