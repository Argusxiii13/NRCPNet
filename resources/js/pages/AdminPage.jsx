import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../components/admin/AdminHeader';
import Sidebar from '../components/admin/AdminSidebar';
import '../../css/styles/admin/AdminPage.css';

function Layout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    
    return (
        <div className="app">
            <Header onMenuClick={toggleSidebar} />
            <Sidebar collapsed={sidebarCollapsed} />
            <div className={`main-container ${!sidebarCollapsed ? 'with-sidebar' : 'with-collapsed-sidebar'}`}>
                <div className="content-area">
                    {/* Your page content goes here */}
                    <h1>Welcome to Admin Dashboard</h1>
                    <p>This is the main content area that will adjust based on sidebar visibility.</p>
                </div>
            </div>
        </div>
    );
}

// Mount the application
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<Layout />);