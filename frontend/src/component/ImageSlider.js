import React, { useState } from "react";
import "../styles/ImageSlider.css";
import img1 from "../assets/images/e1.jpg";
import img2 from "../assets/images/e2.jpg";
import img3 from "../assets/images/e3.jpg";
import img4 from "../assets/images/e4.jpg";
import img5 from "../assets/images/e5.jpg";
import img6 from "../assets/images/e6.jpg";
import img7 from "../assets/images/e7.jpg";
import img8 from "../assets/images/e8.jpg";
import img9 from "../assets/images/e9.jpg";
import img10 from "../assets/images/e10.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="slider-container">
            <button className="arrow left-arrow" onClick={goToPrevious}>
                &#8592;
            </button>
            <div className="slider">
                <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide-img" />
            </div>
            <button className="arrow right-arrow" onClick={goToNext}>
                &#8594;
            </button>
        </div>
    );
};

export default ImageSlider;