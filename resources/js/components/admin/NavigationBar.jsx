import React from 'react';
import { Search } from 'lucide-react';
import '../../../css/styles/admin/NavigationBar.css';
const AdminHeader = () => {
const departments = ['OP', 'OED', 'FAD', 'RDMD', 'RIDD'];
return (
    <header className="admin-header">
        {/* Left Section */}
        <div className="header-section left-section">
            {/* Empty as requested */}
        </div>

        {/* Middle Section */}
        <div className="header-section middle-section">
            <nav className="department-nav">
                {departments.map((dept, index) => (
                    <button
                        key={index}
                        className="department-btn"
                    >
                        {dept}
                    </button>
                ))}
            </nav>
        </div>

        {/* Right Section */}
        <div className="header-section right-section">
            <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                />
            </div>
        </div>
    </header>
);
};

export default AdminHeader;