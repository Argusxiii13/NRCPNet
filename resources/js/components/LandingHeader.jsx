// Header.jsx
import React from 'react';
import '../Styles/LandingHeader.css';

const LPHeader = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="left-container">
                    <div className="logo-container">
                        <img src="/path/to/logo.png" alt="Logo" className="logo" />
                    </div>
                    <h1 className="title">NRCPNet</h1>
                </div>
                <div className="middle-container">
                    <a href="#nrcp-website" className="link">NRCP Website</a>
                    <a href="#nrcp-facebook" className="link">NRCP Facebook</a>
                    <a href="#other-services" className="link">Other Services</a>
                    <a href="#contact" className="link">Contact</a>
                </div>
                <div className="right-container">
                    <button className="login-button">Login</button>
                </div>
            </div>
        </header>
    );
};

export default LPHeader;