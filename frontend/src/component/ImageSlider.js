import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import "../styles/ImageSlider.css"
import img1 from "../assets/images/e1.jpg"
import img2 from "../assets/images/e2.jpg"
import img3 from "../assets/images/e3.jpg"
import img4 from "../assets/images/e4.jpg"
import img5 from "../assets/images/e5.jpg"
import img6 from "../assets/images/e6.jpg"
import img7 from "../assets/images/e7.jpg"
import img8 from "../assets/images/e8.jpg"
import img9 from "../assets/images/e9.jpg"
import img10 from "../assets/images/e10.jpg"

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Auto-play functionality
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        goToNext()
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, goToNext])

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext()
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [goToPrevious, goToNext])

  return (
    <div className="slider-wrapper">
      <div
        className="slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="arrow left-arrow" onClick={goToPrevious} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>

        <div className="slider">
          <div className="slides-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {images.map((image, index) => (
              <div key={index} className={`slide ${index === currentIndex ? "active" : ""}`}>
                <img src={image || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="slide-img" />
              </div>
            ))}
          </div>

          <div className="controls">
            <button
              className="control-btn autoplay-btn"
              onClick={toggleAutoPlay}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>

          <div className="indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button className="arrow right-arrow" onClick={goToNext} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="thumbnails-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          >
            <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageSlider

