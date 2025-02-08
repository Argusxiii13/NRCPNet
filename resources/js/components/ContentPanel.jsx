// ContentPanel.jsx
import React from 'react';

const ContentPanel = () => {
  return (
    <div className="content-panel">
      <h1>Welcome to NRCP NET</h1>
      <p>This is the main content area. Select an option from the sidebar to view different content.</p>
      {/* Add more content or components here */}
      <div className="sample-card">
        <h2>Sample Content Card</h2>
        <p>This is an example of how content can be displayed in this area.</p>
      </div>
    </div>
  );
};

export default ContentPanel;