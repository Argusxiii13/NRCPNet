// AdminLayout.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from '../../js/components/admin/AdminSidebar';
import Header from '../../js/components/admin/AdminHeader';
import '../../css/styles/admin/AdminPage.css';

function Layout({ children }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className={`admin-layout ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
            <Header />
            <div className="admin-content">
                <div className="admin-content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Example usage with routing or component inclusion
const AdminPage = () => {
    return (
        <Layout>
            {/* Your admin page components go here */}
            <div className="welcome-section">
                <h2>Welcome to Admin Dashboard</h2>
                <p>This is the admin dashboard content.</p>
            </div>
            {/* Add more components as needed */}
        </Layout>
    );
};

// Mount the application
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<AdminPage />);