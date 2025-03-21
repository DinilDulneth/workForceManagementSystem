import { useState, useEffect, useCallback } from "react";
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, goToNext]);

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToPrevious, goToNext]);

  return (
    <div style={{maxWidth: "1000px", margin: "0 auto", padding: "20px"}}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "500px",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#000",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            left: "20px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)")}
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
          <div style={{display: "flex", width: "100%", height: "100%", transition: "transform 0.5s ease-in-out", transform: `translateX(-${currentIndex * 100}%)`}}>
            {images.map((image, index) => (
              <div key={index} style={{minWidth: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
                <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}} />
              </div>
            ))}
          </div>

          <div style={{position: "absolute", bottom: "20px", right: "20px", zIndex: 10, display: "flex", gap: "10px"}}>
            <button
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)")}
              onClick={toggleAutoPlay}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>

          <div style={{position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10}}>
            {images.map((_, index) => (
              <button
                key={index}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: index === currentIndex ? "scale(1.2)" : "scale(1)",
                }}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            right: "20px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)")}
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div style={{display: "flex", gap: "10px", marginTop: "20px", overflowX: "auto", padding: "10px 0", scrollbarWidth: "thin"}}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 80px",
              height: "60px",
              borderRadius: "6px",
              overflow: "hidden",
              cursor: "pointer",
              opacity: index === currentIndex ? "1" : "0.6",
              transition: "all 0.3s ease",
              border: index === currentIndex ? "2px solid #3498db" : "2px solid transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = index === currentIndex ? "1" : "0.6")}
            onClick={() => goToSlide(index)}
          >
            <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} style={{width: "100%", height: "100%", objectFit: "cover"}} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;