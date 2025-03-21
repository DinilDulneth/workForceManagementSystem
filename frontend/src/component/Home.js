import React from "react";
import happy from "../assets/images/1.jpg";
import happy1 from "../assets/images/2.jpg";
import happy2 from "../assets/images/3.jpg";
import happy3 from "../assets/images/4.jpg";
import happy4 from "../assets/images/5.jpg";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import StatsRow from "../component/StatsRow.js";
import ImageSlider from "../component/ImageSlider.js";
import Header from "./Header/Header.js";
import Footer from "./Footer/Footer.js";

export default function Home() {
  return (
    <>
    <Header/>
      <ImageSlider/>
      {/* Home Section */}
      <section className="home-section">
        <Container>
          <Row className="align-items-center">
            {/* Text Section */}
            <Col lg="6" className="text-content">
              <p className=" ">
               <span >Lets boost </span>your business with our services....
              </p>
            </Col>

            {/* Image Section */}
            <Col lg="6" className="image-content">
              <img src={happy} alt="Happy" className="happy-img" />
              <img src={happy1} alt="Happy" className="happy-img" />
              <img src={happy2} alt="Happy" className="happy-img" />
              <img src={happy3} alt="Happy" className="happy-img" />
              <img src={happy4} alt="Happy" className="happy-img" />
              
            </Col>
          </Row>
        </Container>
      </section>

      {/* StatsRow Component */}
      <StatsRow />
  

      <br />
      <a href="/UserLogin">Login</a>
      <br />
      <a href="/Register">Register</a>
      <Footer/>
    </>

  );
}
