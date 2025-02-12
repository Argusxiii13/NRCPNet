// DownloadableForms.jsx
import React from 'react';
import '../../../css/styles/landing/DownloadableForms.css';

const DownloadableForms = () => {
    const forms = Array.from({ length: 20 }, (_, index) => ({
        name: `Form ${index + 1}`,
        url: `#download${index + 1}`,
    }));

    return (
        <div className="downloadable-forms-container">
            <h3 className="downloadable-forms-title">Downloadable Forms</h3>
            <div className="downloadable-forms-list">
                {forms.map((form, index) => (
                    <div key={index} className="downloadable-form-item-container">
                        <a href={form.url} className="downloadable-form-item">
                            {form.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadableForms;