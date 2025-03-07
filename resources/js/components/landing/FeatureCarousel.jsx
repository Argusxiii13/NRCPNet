import React, { useState, useEffect } from 'react';
import '../../../css/styles/landing/FeatureCarousel.css';

const EventCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch('/api/features');
                const data = await response.json();
                // Map the data to get the image paths
                setSlides(data.map(feature => feature.content));
            } catch (error) {
                console.error('Error fetching features:', error);
            }
        };

        fetchFeatures();
    }, []);

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
                        {slides.length > 0 ? (
                            <img 
                                src={slides[currentIndex]} 
                                alt={`Slide ${currentIndex + 1}`} 
                            />
                        ) : (
                            <p>No active features available.</p>
                        )}
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