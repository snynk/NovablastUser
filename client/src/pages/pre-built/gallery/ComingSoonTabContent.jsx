import React from "react";

// Coming Soon Tab Content Component
const ComingSoonTabContent = ({ feature }) => {
  return (
    <div className="tab-content" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div className="coming-soon-container">
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚧</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          {feature} Coming Soon
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};


export default ComingSoonTabContent;
