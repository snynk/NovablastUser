import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '@/assets/css/batch-create-send-modal.css';

const BatchCreateSendModal = ({ isOpen, onClose, campaignData, templateData, batchData }) => {
  const [messagesSent, setMessagesSent] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('5043822433');
  const [messagePreview, setMessagePreview] = useState('');
  const [sendingInProgress, setSendingInProgress] = useState(false);
  const [contacts, setContacts] = useState([
    { name: 'Rodney Craft', phone: '5043822433' },
    { name: 'Bradley King', phone: '2052227110' },
    { name: 'Janice Harris', phone: '2055317989' },
    { name: 'Tali Ashkenazi', phone: '9795711793' },
    { name: 'Cary Collard', phone: '8012324193' }
  ]);
  
  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset counters
      setMessagesSent(0);
      setSendingInProgress(false);
      
      // Set total messages from batch data or default to 5
      setTotalMessages(batchData?.totalMessages || contacts.length);
      
      // Set message preview from template data or use default
      if (templateData && templateData.messages && templateData.messages.length > 0) {
        setMessagePreview(templateData.messages[0].content);
      } else {
        setMessagePreview('Hello! I hope you\'re well. Have you received my message about your property?');
      }
      
      // Set contacts from campaign data if available
      if (campaignData && campaignData.contacts && campaignData.contacts.length > 0) {
        setContacts(campaignData.contacts.slice(0, 5));
        if (campaignData.contacts[0]?.phone) {
          setPhoneNumber(campaignData.contacts[0].phone);
        }
      }
    }
  }, [isOpen, campaignData, templateData, batchData]);
  
  const handleSendMessage = () => {
    // Prevent sending if already in progress
    if (sendingInProgress) return;
    
    // Start sending
    setSendingInProgress(true);
    
    // Simulate sending delay (1 second)
    setTimeout(() => {
      setMessagesSent(prev => {
        const newCount = prev + 1;
        return newCount;
      });
      setSendingInProgress(false);
    }, 1000);
  };
  
  // Format campaign and batch info for display
  const campaignName = campaignData?.name || "Campaign";
  const marketName = campaignData?.market || "Market";
  const batchNumber = batchData?.batchNumber || "";
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay14">
      <div className="batch-create-send-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Batch {batchNumber}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="modal-content11">
          {/* Left Side - Campaign Info */}
          <div className="left-panel">
            <div className="info-section">
              <div className="campaign-info">
                <div className="info-icon">
                  <span className="material-icon">📁</span>
                </div>
                <div className="info-content">
                  <div className="info-label">Campaign</div>
                  <div className="info-value">{campaignName}</div>
                </div>
              </div>
              
              <div className="market-info">
                <div className="info-icon">
                  <span className="material-icon">📊</span>
                </div>
                <div className="info-content">
                  <div className="info-label">Current Market</div>
                  <div className="info-value">{marketName}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Message Preview */}
          <div className="right-panel">
            <div className="message-preview-section">
              <h3>Message Preview & Process</h3>
              
              <div className="message-status">
                <div className="progress-circle">
                  <div className="progress-text">
                    <span className="current-count">{messagesSent}</span>/<span className="total-count">{totalMessages}</span>
                  </div>
                  <div className="phone-number">{phoneNumber}</div>
                </div>
                
                <div className="message-content">
                  <p>{messagePreview}</p>
                  <div className="message-count">
                    {messagesSent}/{totalMessages}
                  </div>
                </div>
              </div>
              
              <div className="send-button-container">
                <button 
                  className={`send-message-button ${sendingInProgress ? 'sending' : ''}`}
                  onClick={handleSendMessage}
                  disabled={sendingInProgress || messagesSent >= totalMessages}
                >
                  {sendingInProgress ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact List Table */}
        <div className="contacts-table">
          <div className="table-header">
            <div className="header-name">Name</div>
            <div className="header-phone">Phone Numbers</div>
            <div className="header-status">Status</div>
          </div>
          
          <div className="table-body">
            {contacts.map((contact, index) => (
              <div key={index} className="table-row">
                <div className="row-name">{contact.name}</div>
                <div className="row-phone">{contact.phone}</div>
                <div className="row-status">
                  <div className={`status-indicator ${messagesSent > index ? 'sent' : ''}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCreateSendModal;