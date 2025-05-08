import React, { useEffect, useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Globe, 
  Phone, 
  Tag, 
  ArrowUp, 
  Calendar, 
  SendHorizontal, 
  Clock, 
  Flame, 
  Droplets, 
  BarChart, 
  MessageCircle, 
  CalendarCheck, 
  RefreshCw
} from 'lucide-react';

const ViewCampaignModal = ({ isOpen, campaign, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);
  
  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };
  
  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  
  if (!isOpen || !campaign) return null;
  
  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container view-modal">
        <div className="modal-header">
          <h2>Campaign Details</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          <div className="campaign-main-details">
            {/* Main info - 2 per row */}
            <div className="info-card">
              <div className="card-icon">
                <MessageSquare size={20} />
              </div>
              <div className="card-content">
                <span className="card-label">Campaign Name</span>
                <span className="card-value">{campaign.name}</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="card-icon">
                <Globe size={20} />
              </div>
              <div className="card-content">
                <span className="card-label">Market</span>
                <span className="card-value">{campaign.market}</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="card-icon">
                <Phone size={20} />
              </div>
              <div className="card-content">
                <span className="card-label">Call Forwarding Number</span>
                <span className="card-value">{campaign.callForwardingNumber}</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="card-icon">
                <Tag size={20} />
              </div>
              <div className="card-content">
                <span className="card-label">Campaign Type</span>
                <span className="card-value">{campaign.isFollowUp ? 'Follow-up' : 'Primary'}</span>
              </div>
            </div>
            
            {campaign.isFollowUp && campaign.parentCampaign && (
              <div className="info-card">
                <div className="card-icon">
                  <ArrowUp size={20} />
                </div>
                <div className="card-content">
                  <span className="card-label">Parent Campaign</span>
                  <span className="card-value">{campaign.parentCampaign}</span>
                </div>
              </div>
            )}
            
            {campaign.isFollowUp && campaign.monthWithoutResponse && (
              <div className="info-card">
                <div className="card-icon">
                  <Calendar size={20} />
                </div>
                <div className="card-content">
                  <span className="card-label">Month Without Response</span>
                  <span className="card-value">{campaign.monthWithoutResponse}</span>
                </div>
              </div>
            )}
          </div>
          
          <h3 className="metrics-heading">Campaign Metrics</h3>
          
          <div className="campaign-metrics">
            {/* Metrics - 3 per row */}
            <div className="metric-card">
              <div className="metric-icon">
                <SendHorizontal size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Sent</span>
                <span className="metric-value">{campaign.sent}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">
                <Clock size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Remaining</span>
                <span className="metric-value">{campaign.remaining}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">
                <Flame size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Hot</span>
                <span className="metric-value">{campaign.hot}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">
                <Droplets size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Drip</span>
                <span className="metric-value">{campaign.drip}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">
                <BarChart size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Deliverability</span>
                <span className="metric-value">{campaign.deliverability}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">
                <MessageCircle size={18} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Response</span>
                <span className="metric-value">{campaign.response}</span>
              </div>
            </div>
          </div>
          
          <div className="campaign-dates">
            <div className="date-item">
              <CalendarCheck size={16} />
              <span className="date-label">Created:</span>
              <span className="date-value">{formatDate(campaign.created)}</span>
            </div>
            
            {campaign.updated && (
              <div className="date-item">
                <RefreshCw size={16} />
                <span className="date-label">Last Updated:</span>
                <span className="date-value">{formatDate(campaign.updated)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="close-button-footer" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
      <style jsx>{`
        /* Modal Overlay - Background that covers the entire screen */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.4s ease;
          padding: 1rem;
        }
        
        .modal-overlay.visible {
          opacity: 1;
        }
        
        /* Modal Container - The white box */
           .modal-container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 500px;
          height: 500px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transform: translateY(20px);
          transition: transform 0.4s ease;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -250px;
          margin-top: -250px;
        }
        
        .modal-overlay.visible .modal-container {
          transform: translateY(0);
        }
        
        /* Modal Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
        //   background-color: #4b6bfb;
          border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color:rgb(0, 0, 0);
          font-weight: 600;
        }
        
     
        
        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Modal Content */
        .modal-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        
        /* Campaign Main Details */
        .campaign-main-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        /* Info Cards */
        .info-card {
          background-color: #f9fafc;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #eaedf0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .info-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .card-icon {
          background-color: #ecf0ff;
          color: #4b6bfb;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .card-label {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .card-value {
          font-size: 0.9375rem;
          color: #343a40;
          font-weight: 500;
          word-break: break-word;
        }
        
        /* Metrics Heading */
        .metrics-heading {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 1rem 0;
          padding-top: 0.5rem;
          border-top: 1px solid #eaedf0;
        }
        
        /* Campaign Metrics */
        .campaign-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        /* Metric Cards */
        .metric-card {
          background: linear-gradient(to bottom right, #ffffff, #f9fafc);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #eaedf0;
        }
        
        .metric-icon {
          background-color: #f0f4ff;
          color: #4b6bfb;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        
        .metric-content {
          display: flex;
          flex-direction: column;
        }
        
        .metric-label {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 0.125rem;
        }
        
        .metric-value {
          font-size: 0.9375rem;
          color: #343a40;
          font-weight: 600;
        }
        
        /* Campaign Dates */
        .campaign-dates {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          border-top: 1px solid #eaedf0;
          padding-top: 1rem;
        }
        
        .date-item {
          display: flex;
          align-items: center;
          color: #495057;
          font-size: 0.875rem;
        }
        
        .date-item svg {
          color: #6c757d;
          margin-right: 0.5rem;
        }
        
        .date-label {
          font-weight: 500;
          margin-right: 0.5rem;
        }
        
        .date-value {
          color: #495057;
        }
        
        /* Modal Footer */
        .modal-footer {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        
        .close-button-footer {
          background-color: #4rgb(19, 19, 21)
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.625rem 1.25rem;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .close-button-footer:hover {
          background-color:rgb(190, 190, 190);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .campaign-main-details {
            grid-template-columns: 1fr;
          }
          
          .campaign-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .campaign-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewCampaignModal;