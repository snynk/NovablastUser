import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Phone } from 'lucide-react';
import { getContactLists, getMarkets, getCallForwardingNumberByMarket } from '../../../services/campaignService';

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
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [autoFilledPhone, setAutoFilledPhone] = useState(false);
  
  // Effects
  useEffect(() => {
    if (isOpen) {
      fetchContactLists();
      fetchMarkets();
      resetForm();
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // When market changes, auto-set the call forwarding number
  useEffect(() => {
    if (newCampaign.market) {
      setAutoFilledPhone(false);
      setMarketLoading(true);
      
      const selectedMarket = markets.find(m => m.name === newCampaign.market);
      if (selectedMarket && selectedMarket.callForwardingNumber) {
        const formattedNumber = formatPhoneNumber(selectedMarket.callForwardingNumber);
        setNewCampaign(prev => ({
          ...prev,
          callForwardingNumber: formattedNumber
        }));
        validatePhoneNumber(formattedNumber);
        setAutoFilledPhone(true);
      }
      
      setMarketLoading(false);
    }
  }, [newCampaign.market, markets]);
  
  // Functions
  const resetForm = () => {
    setNewCampaign({ name: '', market: '', callForwardingNumber: '', contactListId: '' });
    setPhoneValid(false);
    setPhoneError('');
    setAutoFilledPhone(false);
  };
  
  const fetchContactLists = async () => {
    try {
      setLoading(true);
      setContactLists(await getContactLists());
    } catch (error) {
      console.error('Error fetching contact lists:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMarkets = async () => {
    try {
      setMarketLoading(true);
      setMarkets(await getMarkets());
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setMarketLoading(false);
    }
  };
  
  const formatPhoneNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
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
    
    return formattedNumber;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const isValid = digitsOnly.length === 10;
    
    setPhoneValid(isValid);
    setPhoneError(digitsOnly.length === 0 ? '' : 
                 digitsOnly.length !== 10 ? 'Phone number must be exactly 10 digits' : '');
                 
    return isValid;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contactListId') {
      setNewCampaign({...newCampaign, [name]: value});
    } else if (name === 'market') {
      setNewCampaign({...newCampaign, [name]: value});
      // The call forwarding number will be set by the useEffect
    } else if (name === 'callForwardingNumber') {
      // Only allow manual editing if not auto-filled or if there was a manual change
      if (!autoFilledPhone || value !== newCampaign.callForwardingNumber) {
        setAutoFilledPhone(false);
        const formattedNumber = formatPhoneNumber(value);
        validatePhoneNumber(formattedNumber);
        setNewCampaign({...newCampaign, [name]: formattedNumber});
      }
    } else {
      setNewCampaign({...newCampaign, [name]: value});
    }
  };
  
  const handleSave = () => {
    onSave(newCampaign);
    resetForm();
    handleClose();
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 400);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`modal-overlay7 ${isVisible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container7">
        {/* Header */}
        <div className="modal-header7">
          <h2>Create New Campaign</h2>
          <button className="close-button" onClick={handleClose}><X size={24} /></button>
        </div>
        
        {/* Content */}
        <div className="modal-content7">
          {/* Row 1: Campaign Name and Market */}
          <div className="form-row form-row-2col">
            <div className="form-group7">
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
            
            <div className="form-group7">
              <label htmlFor="market">Select Market <span style={{ color: 'red' }}>*</span></label>
              <div className="select-wrapper7">
                <select 
                  id="market" 
                  name="market" 
                  value={newCampaign.market} 
                  onChange={handleChange}
                  disabled={marketLoading}
                >
                  <option value="">Select</option>
                  {markets.map((market) => (
                    <option key={market._id || market.name} value={market.name}>
                      {market.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon7" />
              </div>
              {marketLoading && <p style={{ fontSize: '12px', color: '#666' }}>Loading markets...</p>}
            </div>
          </div>
          
          {/* Row 2: Contact List and Call Forwarding Number */}
          <div className="form-row form-row-2col">
            <div className="form-group7">
              <label htmlFor="contact-list">Select Contact List <span style={{ color: 'red' }}>*</span></label>
              <div className="select-wrapper7">
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
                <ChevronDown size={16} className="select-icon7" />
              </div>
              {loading && <p style={{ fontSize: '12px', color: '#666' }}>Loading contact lists...</p>}
            </div>
            
            <div className="form-group7">
              <label htmlFor="forwarding-number">
                Call Forwarding Number <span style={{ color: 'red' }}>*</span>
                {autoFilledPhone && <span style={{ color: 'green', fontSize: '12px', marginLeft: '8px' }}>(Auto-filled)</span>}
              </label>
              <div className="input-wrapper7" style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="forwarding-number"
                  placeholder="(___) ___-____"
                  name="callForwardingNumber"
                  value={newCampaign.callForwardingNumber}
                  onChange={handleChange}
                  style={{
                    borderColor: newCampaign.callForwardingNumber ? (phoneValid ? 'green' : 'red') : '',
                    borderWidth: newCampaign.callForwardingNumber ? '2px' : '1px',
                    backgroundColor: autoFilledPhone ? '#f0f9ff' : '' // Light blue background for auto-filled
                  }}
                />
                {newCampaign.callForwardingNumber && phoneValid && (
                  <Phone size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'green' }} />
                )}
              </div>
              {phoneError && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{phoneError}</p>}
              {phoneValid && !phoneError && <p style={{ color: 'green', fontSize: '12px', marginTop: '4px' }}>Valid phone number</p>}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>Cancel</button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={!newCampaign.name || !newCampaign.market || !phoneValid || !newCampaign.contactListId}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;