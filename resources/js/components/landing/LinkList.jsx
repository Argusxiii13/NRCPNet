// LinkList.jsx
import React from 'react';
import styles from '../../../css/styles/landing/LinkList.module.css';

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
        <div className={styles['linklist-container']}>
            <h3 className={styles['linklist-title']}>Other Links and Systems</h3>
            <div className={styles['linklist']}>
                <div className={styles['linklist-items']}>
                    {links.map((link, index) => (
                        <div key={index} className={styles['link-item-container']}>
                            <img 
                                src={logo} 
                                alt="Company Logo" 
                                className={styles['link-item-logo']} 
                                onError={(e) => { e.target.src = '/image/placeholder.jpg'; }}
                            />
                            <a href={link.url} className={styles['linklist-item']}>
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