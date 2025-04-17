import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown } from 'lucide-react';
// import "./ModalStyles.css";

const CreateCampaignModal = ({ isOpen, onClose, onSave }) => {
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    market: '',
    callForwardingNumber: ''
  });
  const [isVisible, setIsVisible] = useState(false);

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
    setNewCampaign({
      ...newCampaign,
      [name]: value
    });
  };

  const handleSave = () => {
    onSave(newCampaign);
    setNewCampaign({ name: '', market: '', callForwardingNumber: '' });
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
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="campaign-name">Campaign name</label>
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
            <label htmlFor="market">Select Market</label>
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
            <label htmlFor="forwarding-number" className="info-label">
              Call Forwarding Number
              <Info size={16} className="info-icon" />
            </label>
            <input
              type="text"
              id="forwarding-number"
              placeholder="(___) ___-____"
              name="callForwardingNumber"
              value={newCampaign.callForwardingNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;