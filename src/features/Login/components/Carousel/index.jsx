import React, { useState, useEffect } from "react";
import styles from "./styles/Carousel.module.css";

function Carousel({ slides }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        goToNextSlide();
      }
    }, 6000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, isPaused]);

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className={styles.slide} key={index}>
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={
              index === currentSlideIndex
                ? [styles.indicator, styles.active].join(" ")
                : styles.indicator
            }
            onClick={() => setCurrentSlideIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
