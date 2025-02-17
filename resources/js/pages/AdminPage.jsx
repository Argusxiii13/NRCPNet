import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ContentPanel from '../components/admin/ContentPanel';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/AdminHeader';
import '../../css/styles/admin/ContentPanel.css';

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
                </div>
            </div>
        </div>
    );
}

// Mount the application
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<Layout />);