import React from "react";

const ComingSoonTabContent = ({ feature }) => {
  return (
    <div className="tab-content" style={{ textAlign: "center", padding: "80px 0" }}>
      <div className="coming-soon-container">
        <h2>{feature} Coming Soon</h2>
        <p>We're working hard to bring you this feature. Stay tuned for updates!</p>
      </div>
    </div>
  );
};

export default ComingSoonTabContent;
