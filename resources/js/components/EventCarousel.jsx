// EventCarousel.jsx
import React, { useState } from 'react';
import '../Styles/EventCarousel.css';

const EventCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        'Slide 1 Content',
        'Slide 2 Content',
        'Slide 3 Content',
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex - 1 + slides.length) % slides.length
        );
    };

    return (
        <div className="carousel-container">
            <div className="carousel">
                <button 
                    onClick={prevSlide}
                    className="nav-button nav-button-left"
                    aria-label="Previous slide"
                >
                    ❮
                </button>
                
                <button 
                    onClick={nextSlide}
                    className="nav-button nav-button-right"
                    aria-label="Next slide"
                >
                    ❯
                </button>

                <div className="carousel-item">
                    {slides[currentIndex]}
                </div>

                <div className="slide-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventCarousel;