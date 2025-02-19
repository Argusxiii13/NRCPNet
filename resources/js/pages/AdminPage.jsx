// AdminLayout.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from '../../js/components/admin/AdminSidebar';

function Layout() {
    return (
        <Sidebar />
    );
}

// Mount the application
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<Layout />);