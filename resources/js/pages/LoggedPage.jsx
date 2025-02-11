import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ContentPanel from '../components/ContentPanel';
import Sidebar from '../components/Sidebar';
import Header from '../components/LoggedHeader';
import '../../css/styles/ContentPanel.css';

function Layout() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prevState => !prevState);
    };

    return (
        <div className="app">
            <Header isSidebarExpanded={isSidebarExpanded} />
            <div className="main-container">
                <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
                <div className="content">
                    <ContentPanel />
                </div>
            </div>
        </div>
    );
}

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Layout />);