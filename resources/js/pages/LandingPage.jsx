// LandingPage.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../components/landing/LandingHeader';
import EventCarousel from '../components/landing/FeatureCarousel';
import AnnouncementCarousel from '../components/landing/AnnouncementCarousel';
import LinkList from '../components/landing/LinkList';
import DownloadableForms from '../components/landing/DownloadableForms'; // New import
import styles from '../../css/styles/landing/LandingPage.module.css';
import SuggestionBox from '../components/landing/SuggestionBox';
import Calendar from '../components/landing/Calendar';
import ThursdayWellness from '../components/landing/ThursdayWellness';
import SpecialEvents from '../components/landing/SpecialEvents';
import Footer from '../components/landing/Footer';
import '../../css/font.css';
import TimeDisplay from '../components/landing/TimeDisplay';

const LandingPage = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prevState => !prevState);
    };
    
    return (
        <div className={styles['app']}>
            <Header/>
            <div className={styles['main-content']}>
            <div className={styles['welcome-container']}>
                <div className={styles['welcome-section']}>
                    <h2>Welcome to NRCPNet</h2>
                    <p>This is the landing page content.</p>
                </div>
                <TimeDisplay />
            </div>
                <div className={styles['content-grid']}>
                    <div className={styles['event-section']}>
                        <EventCarousel />
                    </div>
                    <div className={styles['announcement-section']}>
                        <AnnouncementCarousel />
                    </div>
                    <div className={styles['links-section']}>
                        <LinkList />
                    </div>
                    <div className={styles['downloadable-forms-section']}> {/* New section */}
                        <DownloadableForms />
                    </div>
                    <div className={styles['thursday-wellness-section']}>
                        <ThursdayWellness />
                        <SpecialEvents />
                    </div>
                    <div className={styles['calendar-section']}>
                        <Calendar />
                        <SuggestionBox/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);