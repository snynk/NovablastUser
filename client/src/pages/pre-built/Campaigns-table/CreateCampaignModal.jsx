import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown, Phone } from 'lucide-react';
import { getContactLists, getContactListPhoneNumbers } from '../../../services/campaignService';

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
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhones, setLoadingPhones] = useState(false);
  
  // Fetch contact lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchContactLists();
      // Reset form when modal opens
      setNewCampaign({
        name: '',
        market: '',
        callForwardingNumber: '',
        contactListId: ''
      });
      setPhoneNumbers([]);
      setPhoneValid(false);
      setPhoneError('');
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

  // Fetch phone numbers when a contact list is selected
  const fetchPhoneNumbers = async (contactListId) => {
    if (!contactListId) {
      setPhoneNumbers([]);
      return;
    }

    try {
      setLoadingPhones(true);
      const phones = await getContactListPhoneNumbers(contactListId);
      setPhoneNumbers(phones);
      setLoadingPhones(false);
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      setPhoneNumbers([]);
      setLoadingPhones(false);
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
    
    if (name === 'contactListId' && value) {
      // When a contact list is selected, fetch associated phone numbers
      fetchPhoneNumbers(value);
      
      setNewCampaign({
        ...newCampaign,
        [name]: value,
        // Don't reset forwarding number automatically
        // Leave it as is when changing contact list
      });
    } else if (name === 'contactPhoneNumber') {
      // When selecting a phone number from the contact list dropdown
      // Update the state but don't change the forwarding number
      setNewCampaign({
        ...newCampaign,
        // We don't store this in newCampaign, it's just for display
      });
    } else if (name === 'callForwardingNumber') {
      // Handle when a phone is selected from dropdown (already formatted)
      if (value.includes('(') && value.length > 8) {
        setPhoneError('');
        setPhoneValid(true);
        
        setNewCampaign({
          ...newCampaign,
          [name]: value
        });
      } else {
        // Only allow digits for manual entry
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
      }
    } else {
      setNewCampaign({
        ...newCampaign,
        [name]: value
      });
    }
  };

  // Function to set the selected phone number as the forwarding number
  const handleSetAsForwarding = (phoneNumber) => {
    setNewCampaign({
      ...newCampaign,
      callForwardingNumber: phoneNumber
    });
    setPhoneValid(true);
    setPhoneError('');
  };
  
  const handleSave = () => {
    // Send the campaign data with the contactListId as a string (SampleName)
    onSave(newCampaign);
    setNewCampaign({ name: '', market: '', callForwardingNumber: '', contactListId: '' });
    setPhoneError('');
    setPhoneValid(false);
    setPhoneNumbers([]);
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
      className={`modal-overlay7 ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container7">
        <div className="modal-header7">
          <h2>Create New Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content7">
          {/* First row with 2 fields: Campaign Name and Market */}
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
                >
                  <option value="">Select</option>
                  <option value="Houston - TX">Houston - TX</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="California">California</option>
                </select>
                <ChevronDown size={16} className="select-icon7" />
              </div>
            </div>
          </div>
          
          {/* Second row with 2 fields: Contact List and Call Forwarding Number */}
          <div className="form-row form-row-2col">
            {/* Contact List Selection */}
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
            
            {/* Call Forwarding Number */}
            <div className="form-group7">
              <label htmlFor="forwarding-number" className="info-label">
                Call Forwarding Number <span style={{ color: 'red' }}>*</span>
                {/* <Info size={16} className="info-icon" style={{ marginLeft: '5px', color: '#888' }} /> */}
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
                    borderColor: newCampaign.callForwardingNumber ? 
                      (phoneValid ? 'green' : 'red') : '',
                    borderWidth: newCampaign.callForwardingNumber ? '2px' : '1px'
                  }}
                />
                {newCampaign.callForwardingNumber && phoneValid && (
                  <Phone size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'green' }} />
                )}
              </div>
              
              {phoneError && (
                <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{phoneError}</p>
              )}
              {phoneValid && !phoneError && (
                <p style={{ color: 'green', fontSize: '12px', marginTop: '4px' }}>Valid phone number</p>
              )}
            </div>
          </div>
          
          {/* Contact List Phone Numbers - Full width in its own row */}
          {newCampaign.contactListId && (
            <div className="form-row">
              <div className="form-group7" style={{ width: '100%' }}>
                <label htmlFor="contact-phones">Contact List Phone Numbers</label>
                <div className="select-wrapper7">
                  <select
                    id="contact-phones"
                    name="contactPhoneNumber"
                    onChange={(e) => handleSetAsForwarding(e.target.value)}
                    disabled={loadingPhones}
                  >
                    <option value="">Select to use as forwarding number</option>
                    {phoneNumbers.map((phone) => (
                      <option key={phone.id} value={phone.number}>
                        {phone.number} - {phone.type} ({phone.contact})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="select-icon7" />
                </div>
                
                {loadingPhones && (
                  <p style={{ fontSize: '12px', color: '#666' }}>Loading phone numbers...</p>
                )}
                
                {!loadingPhones && phoneNumbers.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#666' }}>No phone numbers found for this contact list</p>
                )}
              </div>
            </div>
          )}
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