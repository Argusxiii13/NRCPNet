import React from 'react';
import { Search } from 'lucide-react'; // Import the search icon
import '../../../css/styles/admin/AdminHeader.css'; // Import CSS for styling

const Header = ({ isSidebarExpanded }) => {
    return (
        <div className={`header ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
            <div className="left-container">
                <div className="button-group">
                    <button className="header-button">FAD</button>
                    <button className="header-button">RDMD</button>
                    <button className="header-button">RIDD</button>
                </div>
            </div>
            <div className="right-container">
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search..." />
                    <Search className="search-icon" />
                </div>
                <button className="login-button">Login</button>
            </div>
        </div>
    );
};

export default Header;