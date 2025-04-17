// Dashboard.jsx
import React from 'react';
import { MessageSquare, Clock, Bell, HelpCircle, Info } from 'lucide-react';
import "@/assets/css/style.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      {/* Main Title */}
        <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 20px 0'}}>Dashboard</h1>
    
      <div className="dashboard-container">
        {/* Status Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">What's on your plate</h2>
            <div className="card-actions">
              <Info size={18} className="info-icon" />
            </div>
          </div>
          
          <div className="status-list">
            <div className="status-item unread">
              <div className="status-icon">
                <MessageSquare size={20} className="icon" />
              </div>
              <div className="status-content">
                <h3>Unread</h3>
                <p>Respond now →</p>
              </div>
              <div className="status-count">865</div>
            </div>
            
            <div className="status-item unanswered">
              <div className="status-icon">
                <Clock size={20} className="icon" />
              </div>
              <div className="status-content">
                <h3>Unanswered</h3>
                <p>Reply now →</p>
              </div>
              <div className="status-count">946</div>
            </div>
            
            <div className="status-item reminder">
              <div className="status-icon">
                <Bell size={20} className="icon" />
              </div>
              <div className="status-content">
                <h3>Reminder</h3>
                <p>View now →</p>
              </div>
              <div className="status-count">0</div>
            </div>
            
            <div className="status-item no-status">
              <div className="status-icon">
                <HelpCircle size={20} className="icon" />
              </div>
              <div className="status-content">
                <h3>No status</h3>
                <p>View Inbox →</p>
              </div>
              <div className="status-count">952</div>
            </div>
          </div>
        </div>

        {/* Prospect Leads */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Prospect Leads</h2>
            <div className="card-actions">
            {/* <Info size={18} className="info-icon" /> */}
            <button className="dropdown-button">
                Today
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="prospect-grid">
            <div className="metric-card">
              <div className="progress-container">
                <div className="progress-circle delivery">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e6f7ff" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#4dabf7" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="282.7" />
                    <circle cx="50" cy="5" r="5" fill="#4dabf7" />
                  </svg>
                  <div className="progress-value">0.00</div>
                </div>
              </div>
            </div>
            
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-name">Initial Msg</span>
                <span className="stat-value">0%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Inbox</span>
                <span className="stat-value">0%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Drips</span>
                <span className="stat-value">0%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Follow Up</span>
                <span className="stat-value">0%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="progress-container">
                <div className="progress-circle response">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e6f7ff" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#74c0fc" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="282.7" />
                    <circle cx="50" cy="5" r="5" fill="#74c0fc" />
                  </svg>
                  <div className="progress-value">0.00</div>
                </div>
              </div>
            </div>
            
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-name">Initial Msg</span>
                <span className="stat-value">0.00%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Inbox</span>
                <span className="stat-value">0%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Drips</span>
                <span className="stat-value">0%</span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Follow Up</span>
                <span className="stat-value">0.00%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lead Breakdown */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Lead Breakdown</h2>
            <div className="card-actions">
              {/* <Info size={18} className="info-icon" /> */}
              <button className="dropdown-button">
                Today
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="lead-breakdown">
            <div className="lead-chart">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" strokeWidth="10" />
                <path d="M50,5 A45,45 0 0,1 95,50" fill="none" stroke="#dc3545" strokeWidth="10" />
              </svg>
              <div className="lead-chart-center">
                <span className="lead-chart-label">Total</span>
                <span className="lead-chart-total">201</span>
              </div>
            </div>
            
            <div className="lead-legend">
              <div className="legend-item">
                <div className="legend-color hot"></div>
                <span className="legend-text">Hot 20</span>
              </div>
              <div className="legend-item">
                <div className="legend-color warm"></div>
                <span className="legend-text">Warm 0</span>
              </div>
              <div className="legend-item">
                <div className="legend-color nurture"></div>
                <span className="legend-text">Nurture 0</span>
              </div>
              <div className="legend-item">
                <div className="legend-color drip"></div>
                <span className="legend-text">Drip 0</span>
              </div>
              <div className="legend-item">
                <div className="legend-color no-status-legend"></div>
                <span className="legend-text">No Status 181</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;