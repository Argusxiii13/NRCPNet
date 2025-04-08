// LandingPage.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../components/landing/LandingHeader';
import FeatureCarousel from '../components/landing/FeatureCarousel';
import AnnouncementCarousel from '../components/landing/AnnouncementCarousel';
import Resources from '../components/landing/Resources';
import DownloadableForms from '../components/landing/DownloadableForms';
import SuggestionBox from '../components/landing/SuggestionBox';
import Calendar from '../components/landing/Calendar';
import ThursdayWellness from '../components/landing/ThursdayWellness';
import SpecialEvents from '../components/landing/TodaysEvents';
import Footer from '../components/landing/Footer';
import TimeDisplay from '../components/landing/TimeDisplay';
import styles from '../../css/styles/landing/LandingPage.module.css';
import '../../css/font.css';

const LandingPage = () => {
    // State to track if ThursdayWellness has content
    const [hasThursdayWellnessContent, setHasThursdayWellnessContent] = useState(true);
    
    // Handler function for ThursdayWellness content changes
    const handleWellnessContentChange = (hasContent) => {
        setHasThursdayWellnessContent(hasContent);
    };

    // Dynamically apply class names based on content availability
    const getThursdayWellnessClassName = () => {
        if (!hasThursdayWellnessContent) {
            return `${styles['thursday-wellness']} ${styles['empty-container']}`;
        }
        return styles['thursday-wellness'];
    };

    const getSpecialEventsClassName = () => {
        // If ThursdayWellness has no content, move SpecialEvents to ThursdayWellness position
        if (!hasThursdayWellnessContent) {
            return styles['thursday-wellness']; // Use ThursdayWellness grid position
        }
        return styles['special-events'];
    };

    return (
        <div className={styles['app']}>
            <div className={styles['header']}>
                <Header />
            </div>
            
            <div className={styles['main-content']}>
                {/* Welcome Section */}
                <div className={styles['welcome-section']}>
                    <div className={styles['welcome-text']}>
                        <h2>Welcome to NRCPNet</h2>
                        <p>Your central hub for information and resources.</p>
                    </div>
                    <TimeDisplay />
                </div>

                {/* First Section - Event Carousel */}
                <div className={styles['first-section']}>
                    <div className={styles['feature-carousel']}>
                        <FeatureCarousel />
                    </div>
                </div>

                {/* Separator */}
                <div className={styles['section-separator']}></div>

                {/* Second Section - Announcement and Links */}
                <div className={styles['second-section']}>
                    <div className={styles['announcement-carousel']}>
                        <AnnouncementCarousel />
                    </div>
                    <div className={styles['resources']}>
                        <Resources />
                    </div>
                </div>

                {/* Third Section - Complex Layout */}
                <div className={styles['third-section']}>
                    <div className={styles['downloadable-forms']}>
                        <DownloadableForms />
                    </div>
                    
                    {/* Only render ThursdayWellness if it has content */}
                    {hasThursdayWellnessContent && (
                        <div className={getThursdayWellnessClassName()}>
                            <ThursdayWellness onContentChange={handleWellnessContentChange} />
                        </div>
                    )}
                    
                    {/* Always render SpecialEvents but with dynamic positioning */}
                    <div className={getSpecialEventsClassName()}>
                        <SpecialEvents />
                    </div>
                    
                    {/* If ThursdayWellness has no content, render a hidden container in its original place */}
                    {!hasThursdayWellnessContent && (
                        <div className={`${styles['special-events']} ${styles['empty-container']}`}></div>
                    )}
                    
                    <div className={styles['calendar']}>
                        <Calendar />
                    </div>
                    
                    <div className={styles['suggestion-box']}>
                        <SuggestionBox />
                    </div>
                </div>
            </div>

            <div className={styles['footer']}>
                <Footer />
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);
export default LandingPage;