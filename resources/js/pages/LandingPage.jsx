import React from 'react';
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
                    
                    <div className={styles['thursday-wellness']}>
                        <ThursdayWellness />
                    </div>
                    
                    <div className={styles['special-events']}>
                        <SpecialEvents />
                    </div>
                    
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