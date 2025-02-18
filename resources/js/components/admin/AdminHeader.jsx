// AdminHeader.jsx
import React from 'react';
import { Search, MenuIcon, ChevronLeft, ChevronRight } from 'lucide-react'; // Import menu icon
import '../../../css/styles/admin/AdminHeader.css';

const AdminHeader = ({ onMenuClick }) => {
    const handleSearch = (event) => {
        event.preventDefault();
        // Placeholder for search functionality
        alert('Search functionality to be implemented');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="left-container">
                    <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle sidebar">
                        <MenuIcon size={24} color="#007bff" />
                    </button>
                    <div className="logo-container">
                        <img src="/path/to/logo.png" alt="Logo" className="logo" />
                    </div>
                    <h1 className="title">NRCPNet Admin</h1>
                </div>
                <div className="middle-container">
                    <a href="#op" className="link">OP</a>
                    <a href="#oed" className="link">OED</a>
                    <a href="#fad" className="link">FAD</a>
                    <a href="#rdmd" className="link">RDMD</a>
                    <a href="#ridd" className="link">RIDD</a>
                </div>
                <div className="right-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-container">
                            <input type="text" className="search-input" placeholder="Search..." />
                            <Search className="search-icon" />
                        </div>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;