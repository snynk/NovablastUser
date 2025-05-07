import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown } from 'lucide-react';
import { getContactLists } from '../../../services/campaignService';
// import "../../../assets/css/modal.css";

const CreateCampaignModal = ({ isOpen, onClose, onSave }) => {
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    market: '',
    callForwardingNumber: '',
    contactListId: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch contact lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchContactLists();
    }
  }, [isOpen]);
  
  // Fetch contact lists for dropdown
  const fetchContactLists = async () => {
    try {
      setLoading(true);
      const lists = await getContactLists();
      setContactLists(lists);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact lists:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // Set timeout to allow the DOM to update before adding visible class
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'callForwardingNumber') {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Validate phone number
      if (digitsOnly.length === 0) {
        setPhoneError('');
        setPhoneValid(false);
      } else if (digitsOnly.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits');
        setPhoneValid(false);
      } else {
        setPhoneError('');
        setPhoneValid(true);
      }
      
      // Format phone number as (XXX) XXX-XXXX
      let formattedNumber = '';
      if (digitsOnly.length > 0) {
        formattedNumber = digitsOnly.slice(0, 10);
        if (formattedNumber.length > 3) {
          formattedNumber = `(${formattedNumber.slice(0, 3)}) ${formattedNumber.slice(3)}`;
        }
        if (formattedNumber.length > 9) {
          formattedNumber = `${formattedNumber.slice(0, 9)}-${formattedNumber.slice(9)}`;
        }
      }
      
      setNewCampaign({
        ...newCampaign,
        [name]: formattedNumber
      });
    } else {
      setNewCampaign({
        ...newCampaign,
        [name]: value
      });
    }
  };
  
  const handleSave = () => {
    // Send the campaign data with the contactListId as a string (SampleName)
    onSave(newCampaign);
    setNewCampaign({ name: '', market: '', callForwardingNumber: '', contactListId: '' });
    setPhoneError('');
    setPhoneValid(false);
    handleClose();
  };
  
  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
    }, 400);
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container1">
        <div className="modal-header">
          <h2>Create New Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="campaign-name">Campaign name <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              id="campaign-name"
              placeholder="Enter name"
              name="name"
              value={newCampaign.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="market">Select Market <span style={{ color: 'red' }}>*</span></label>
            <div className="select-wrapper">
              <select
                id="market"
                name="market"
                value={newCampaign.market}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Houston - TX">Houston - TX</option>
                <option value="North Carolina">North Carolina</option>
                <option value="California">California</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="contact-list">Select Contact List <span style={{ color: 'red' }}>*</span></label>
            <div className="select-wrapper">
              <select
                id="contact-list"
                name="contactListId"
                value={newCampaign.contactListId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select</option>
                {contactLists.map((list) => (
                  <option key={list.name} value={list.name}>
                    {list.name} ({list.count} contacts)
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
            {loading && <p style={{ fontSize: '12px', color: '#666' }}>Loading contact lists...</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="forwarding-number" className="info-label">
              Call Forwarding Number <span style={{ color: 'red' }}>*</span>
              <Info size={16} className="info-icon" style={{ marginLeft: '5px', color: '#888' }} />
            </label>
            <input
              type="text"
              id="forwarding-number"
              placeholder="(___) ___-____"
              name="callForwardingNumber"
              value={newCampaign.callForwardingNumber}
              onChange={handleChange}
              style={{
                borderColor: newCampaign.callForwardingNumber ? 
                  (phoneValid ? 'green' : 'red') : '',
                borderWidth: newCampaign.callForwardingNumber ? '2px' : '1px'
              }}
            />
            {phoneError && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{phoneError}</p>
            )}
            {phoneValid && (
              <p style={{ color: 'green', fontSize: '12px', marginTop: '4px' }}>Valid phone number</p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={
              !newCampaign.name || 
              !newCampaign.market || 
              !phoneValid || 
              !newCampaign.contactListId
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;