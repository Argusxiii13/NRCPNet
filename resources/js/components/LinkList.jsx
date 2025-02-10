// LinkList.jsx
import React from 'react';
import '../Styles/LinkList.css';

const logo = '/image/CompanyLogo.jpg';

const LinkList = () => {
    const links = [
        { name: 'National Integrated Basic Research Agenda', url: '#system1' },
        { name: 'Commissioned Research', url: '#system2' },
        { name: 'Kapakanan Ng Tao Sa Oras Ng Pandemya - COVID', url: '#system3' },
        { name: 'System 4', url: '#system4' },
        { name: 'System 5', url: '#system5' },
        { name: 'System 6', url: '#system6' },
    ];

    return (
        <div className="linklist-container">
            <h3 className="linklist-title">Other Links and Systems</h3>
            <div className="linklist">
                <div className="linklist-items">
                    {links.map((link, index) => (
                        <div key={index} className="link-item-container">
                            <img 
                                src={logo} 
                                alt="Company Logo" 
                                className="link-item-logo" 
                                onError={(e) => { e.target.src = '/image/placeholder.jpg'; }}
                            />
                            <a href={link.url} className="linklist-item">
                                {link.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LinkList;