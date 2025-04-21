import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const transitionTimeout = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Clear previous timeout if exists
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    // Set new timeout for transition end
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  }, [isTransitioning]);

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Auto-play with improved performance
  useEffect(() => {
    let interval;
    if (isPlaying && !isTransitioning) {
      interval = setInterval(() => {
        goToNext();
      }, 5000); // Increased duration for better viewing
    }
    return () => {
      clearInterval(interval);
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, [isPlaying, isTransitioning, goToNext]);

  // Improved touch handling
  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      if (touchDiff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  return (
    <div style={styles.mainContainer}>
    {/* Trust Banner */}
    <div style={styles.trustBanner}>
      <h2 style={styles.trustTitle}>Trusted by Leading Companies</h2>
      <p style={styles.trustText}>
        Join hundreds of organizations that trust our workforce management solutions
      </p>
    </div>
      <div style={styles.sliderContainer}>
        <div
          style={styles.sliderWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* ...existing navigation buttons... */}
          <div style={styles.slideTrack}>
            <div style={{
              ...styles.slideStrip,
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-out' : 'none'
            }}>
              {images.map((image, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.slide,
                    opacity: index === currentIndex ? 1 : 0.7
                  }}
                >
                  <img 
                    src={image} 
                    alt={`Slide ${index + 1}`} 
                    style={styles.slideImage}
                    loading="lazy" // Add lazy loading
                  />
                </div>
              ))}
            </div>
            {/* ...existing controls... */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated styles for smoother transitions
const styles = {
  // ...existing styles...
  mainContainer: {
    backgroundColor: "#f8f9fa",
    padding: "40px 0"
  },
  trustBanner: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
    padding: "0 20px"
  },
  trustTitle: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: "12px"
  },
  trustText: {
    fontSize: "18px",
    color: "#636e72",
    lineHeight: "1.6"
  },
  sliderContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px"
  },
  sliderWrapper: {
    position: "relative",
    width: "100%",
    height: "600px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#000"
  },
  slideTrack: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#000"
  },
  slideStrip: {
    display: "flex",
    width: "100%",
    height: "100%",
    willChange: "transform", // Optimize performance
    backfaceVisibility: "hidden", // Reduce flickering
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  },
  slide: {
    minWidth: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.5s ease-out"
  },
  slideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    backfaceVisibility: "hidden" // Reduce flickering
  }
};

export default ImageSlider;