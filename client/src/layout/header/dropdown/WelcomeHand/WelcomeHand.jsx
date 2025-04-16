import React from "react";

const NotificationIconsRow = () => {
  return (
    <div className="notification-row">
      {/* Message Notification */}
      <div className="notification-item">
        <div className="notification-icon yellow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="notification-badge yellow-badge">99+</div>
      </div>

      {/* Timer Notification */}
      <div className="notification-item">
        <div className="notification-icon orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v10l4.24 4.24" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="notification-badge orange-badge">99+</div>
      </div>

      {/* Bell Notification */}
      <div className="notification-item">
        <div className="notification-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="notification-badge blue-badge">99+</div>
      </div>

      {/* Question Mark Notification */}
      <div className="notification-item">
        <div className="notification-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="notification-badge purple-badge">99+</div>
      </div>

      <style jsx>{`
        .notification-row {
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .notification-item {
          position: relative;
        }
        
        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .yellow {
          background-color:rgb(255, 239, 185);
          color: #FFD44C;
        }
        
        .orange {
          background-color:rgb(255, 213, 205);
          color: #FF9966;
        }
        
        .blue {
          background-color:rgb(211, 228, 254);
          color: #A4C1F7;
        }
        
        .purple {
          background-color:rgb(224, 215, 254);
          color: #BEB1F1;
        }
        
        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: white;
          padding: 0 6px;
        }
        
        .yellow-badge {
          background-color: #FFD44C;
        }
        
        .orange-badge {
          background-color: #FF9966;
        }
        
        .blue-badge {
          background-color: #A4C1F7;
        }
        
        .purple-badge {
          background-color: #BEB1F1;
        }
      `}</style>
    </div>
  );
};

export default NotificationIconsRow;