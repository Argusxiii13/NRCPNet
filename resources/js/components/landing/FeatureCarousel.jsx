// EventCarousel.jsx
import React, { useState } from 'react';
import '../../../css/styles/landing/FeatureCarousel.css';

// Image path constants
const Feature1 = '/image/Feature1.png';
const Feature2 = '/image/Feature2.png';
const Feature3 = '/image/Feature3.png';
const Feature4 = '/image/Feature4.png';
const Feature5 = '/image/Feature5.png';
const Feature6 = '/image/Feature6.png';


const EventCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    
    // Updated slides to only include images
    const slides = [
        Feature1,
        Feature2,
        Feature3,
        Feature4,
        Feature5,
        Feature6,
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
        <div 
            className="carousel-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="carousel">
                {/* Left half click area for previous slide */}
                <div 
                    className="carousel-nav-area carousel-nav-left"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    {isHovering && (
                        <button className="nav-button nav-button-left">
                            ❮
                        </button>
                    )}
                </div>
                
                {/* Right half click area for next slide */}
                <div 
                    className="carousel-nav-area carousel-nav-right"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    {isHovering && (
                        <button className="nav-button nav-button-right">
                            ❯
                        </button>
                    )}
                </div>

                <div className="carousel-item">
                    <div className="carousel-image">
                        <img 
                            src={slides[currentIndex]} 
                            alt={`Slide ${currentIndex + 1}`} 
                        />
                    </div>
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