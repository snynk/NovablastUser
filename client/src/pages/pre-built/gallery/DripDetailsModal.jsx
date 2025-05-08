import React, { useEffect, useState } from 'react';
import { X, Info, Calendar, Mail, Tag, Clock, MessageCircle } from 'lucide-react';

/**
 * Enhanced Modal component for displaying detailed information about a drip automation
 */
export default function DripDetailsModal({ isOpen, onClose, automationData }) {
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
  
  if (!isOpen || !automationData) return null;
  
  // Sort messages by day for proper display
  const sortedMessages = automationData.messages && automationData.messages.length > 0
    ? [...automationData.messages].sort((a, b) => a.day - b.day)
    : [];

  return (
    <div 
      className={`modal-overlay3 ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container2">
        <div className="modal-header">
          <h2 className="modal-title">Drip Automation Details</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content9">
          {/* Automation Basic Info */}
          <div className="info-section8">
            <h3 className="section-title8">
              <Info size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
              Basic Information
            </h3>
            <div className="info-grid8">
              <div className="info-item8">
                <span className="info-label8">Name:</span>
                <span className="info-value8">{automationData.name}</span>
              </div>
              <div className="info-item8">
                <span className="info-label8">Status:</span>
                <span className={`status-badge1 ${(automationData.status || 'Active').toLowerCase()}`}>
                  {automationData.status || 'Active'}
                </span>
              </div>
              <div className="info-item8">
                <span className="info-label8">Total Messages:</span>
                <span className="info-value8">{sortedMessages.length}</span>
              </div>
              {automationData.description && (
                <div className="info-item8 full-width8">
                  <span className="info-label8">Description:</span>
                  <span className="info-value8">{automationData.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="info-section8">
            <h3 className="section-title8">
              <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
              Messages Timeline
            </h3>
            
            {sortedMessages.length === 0 ? (
              <div className="empty-messages">
                <Mail size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <div>No messages configured for this automation.</div>
              </div>
            ) : (
              <div className="messages-timeline8">
                {sortedMessages.map((message, index) => (
                  <div key={index} className="timeline-item8">
                    <div className="day-circle8">Day {message.day}</div>
                    <div className="message-card8">
                      <div className="message-header8">
                        {message.subject && (
                          <div className="message-subject8">
                            <span className="message-label8">Subject:</span> 
                            {message.subject}
                          </div>
                        )}
                        {message.type && (
                          <div className="message-type8">
                            <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            Type: <span className="type-badge8">{message.type}</span>
                          </div>
                        )}
                      </div>
                      <div className="message-body8">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information (if available) */}
          {automationData.tags && automationData.tags.length > 0 && (
            <div className="info-section8">
              <h3 className="section-title8">
                <Tag size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Tags
              </h3>
              <div className="tags-container8">
                {automationData.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="view-modal-footer">
            <button className="close-view-button1" onClick={handleClose}>
              {/* <MessageCircle size={16} style={{ marginRight: '6px' }} /> */}
              Close
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Modal Overlay */
        .modal-overlay3 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .modal-overlay3.visible {
          opacity: 1;
        }
        
        /* Modal Container */
        .modal-container2 {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 500px;
          height: 500px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -250px;
          margin-top: -250px;
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }
        
        .modal-overlay3.visible .modal-container2 {
          transform: translateY(0);
        }
        
        /* Modal Header */
   
        
        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          color: #ffffff;
          font-weight: 600;
        }
        
      
        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Modal Content */
        .modal-content9 {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          height: calc(500px - 126px); /* Subtract header and footer height */
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        
        /* Custom scrollbar for Chrome, Edge, and Safari */
        .modal-content9::-webkit-scrollbar {
          width: 8px;
        }
        
        .modal-content9::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        
        .modal-content9::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        
        /* Info Sections */
        .info-section8 {
          margin-bottom: 1.5rem;
          background-color: #f9fafc;
          border-radius: 10px;
          padding: 1.25rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #eaedf0;
        }
        
        .section-title8 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eaedf0;
          display: flex;
          align-items: center;
        }
        
        /* Info Grid */
        .info-grid8 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .info-item8 {
          display: flex;
          flex-direction: column;
        }
        
        .info-item8.full-width8 {
          grid-column: 1 / -1;
        }
        
        .info-label8 {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .info-value8 {
          font-size: 0.9375rem;
          color: #343a40;
          font-weight: 500;
          word-break: break-word;
        }
        
        /* Status Badge */
        .status-badge1 {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-badge1.active {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-badge1.paused {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .status-badge1.draft {
          background-color: #e5e7eb;
          color: #4b5563;
        }
        
        .status-badge1.completed {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        /* Empty Messages */
        .empty-messages {
          padding: 1.5rem;
          text-align: center;
          color: #6c757d;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px dashed #dee2e6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        /* Messages Timeline */
        .messages-timeline8 {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .timeline-item8 {
          display: flex;
          gap: 1rem;
          position: relative;
        }
        
        .day-circle8 {
          background-color: #4b6bfb;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
          flex-shrink: 0;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(75, 107, 251, 0.3);
        }
        
        .message-card8 {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 1rem;
          flex-grow: 1;
          border: 1px solid #eaedf0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1;
        }
        
        /* Add timeline connecting line between day circles */
        .timeline-item8:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 50px;
          left: 25px;
          width: 2px;
          height: calc(100% + 1rem);
          background-color: #d1d9ff;
          z-index: 0;
        }
        
        .message-header8 {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
          gap: 0.5rem;
        }
        
        .message-subject8 {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9375rem;
        }
        
        .message-label8 {
          color: #6c757d;
          font-weight: normal;
        }
        
        .message-type8 {
          font-size: 0.8125rem;
          color: #6c757d;
          display: flex;
          align-items: center;
        }
        
        .type-badge8 {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #e9ecef;
          color: #495057;
        }
        
        .message-body8 {
          font-size: 0.875rem;
          color: #495057;
          line-height: 1.5;
          white-space: pre-wrap;
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 0.75rem;
          border: 1px solid #eaedf0;
        }
        
        /* Tags */
        .tags-container8 {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tag-badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #ecf0ff;
          color: #4b6bfb;
          border: 1px solid #d1d9ff;
        }
        
        /* Modal Footer */
        .modal-footer {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        
        .view-modal-footer {
          display: flex;
          gap: 0.5rem;
        }
        
       
        /* Responsive adjustments */
        @media (max-width: 540px) {
          .modal-container2 {
            width: 90%;
            height: 90%;
            max-height: 90vh;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) translateY(20px);
            margin-left: 0;
            margin-top: 0;
          }
          
          .modal-overlay3.visible .modal-container2 {
            transform: translate(-50%, -50%) translateY(0);
          }
          
          .modal-content9 {
            height: calc(100% - 126px);
          }
          
          .info-grid8 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}