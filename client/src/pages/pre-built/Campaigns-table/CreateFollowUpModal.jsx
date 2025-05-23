import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown, Search } from 'lucide-react';
import { getParentCampaigns, getContactLists } from '../../../services/campaignService';

// Campaign Selection Modal Component
const SelectCampaignModal = ({ isOpen, onClose, onSelect, campaigns }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Set timeout to allow the DOM to update before adding visible class
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

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

  const handleSelect = (campaign) => {
    onSelect(campaign);
    handleClose();
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay7 campaign-select-modal ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
      style={{ zIndex: 1100 }} // Higher z-index than parent modal
    >
      <div className="modal-container7" onClick={e => e.stopPropagation()}>
        <div className="modal-header7">
          <h2>Select A Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content7">
          <div className="search-campaign-wrapper">
            <Search size={20} className="search-campaign-icon" />
            <input 
              type="text" 
              placeholder="Search Campaigns" 
              className="search-campaign-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <p className="campaign-select-description">
            Select a parent campaign to create a follow-up for prospects who haven't responded
          </p>
          
          <div className="campaign-table-container">
            <table className="campaign-select-table">
              <thead>
                <tr>
                  <th className="campaign-name-col">Name</th>
                  <th className="prospects-col">Prospects Available</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map(campaign => (
                    <tr key={campaign._id}>
                      <td className="campaign-name-col">{campaign.name}</td>
                      <td className="prospects-col">{campaign.sent - campaign.hot || 0}</td>
                      <td className="actions-col">
                        <button 
                          className="create-user-button create-button select-campaign-button"
                          onClick={() => handleSelect(campaign)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No parent campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact List Selection Modal Component
const SelectContactListModal = ({ isOpen, onClose, onSelect, contactLists }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSelect = (contactList) => {
    onSelect(contactList);
    handleClose();
  };

  const filteredContactLists = contactLists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay7 contact-select-modal ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
      style={{ zIndex: 1100 }}
    >
      <div className="modal-container7" onClick={e => e.stopPropagation()}>
        <div className="modal-header7">
          <h2>Select A Contact List</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content7">
          <div className="search-campaign-wrapper">
            <Search size={20} className="search-campaign-icon" />
            <input 
              type="text" 
              placeholder="Search Contact Lists" 
              className="search-campaign-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <p className="campaign-select-description">
            Select a contact list for your follow-up campaign
          </p>
          
          <div className="campaign-table-container">
            <table className="campaign-select-table">
              <thead>
                <tr>
                  <th className="list-name-col">List Name</th>
                  <th className="contacts-col">Contacts</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContactLists.length > 0 ? (
                  filteredContactLists.map(list => (
                    <tr key={list.id}>
                      <td className="list-name-col">{list.name}</td>
                      <td className="contacts-col">{list.count}</td>
                      <td className="actions-col">
                        <button 
                          className="create-user-button create-button select-campaign-button"
                          onClick={() => handleSelect(list)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No contact lists found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateFollowUpModal = ({ isOpen, onClose, onSave }) => {
  const [followUpCampaign, setFollowUpCampaign] = useState({
    campaign: '',
    market: '',
    month: '',
    title: '',
    description: '',
    contactListId: '',
    status: 'active'
  });
  const [parentCampaigns, setParentCampaigns] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);
  const [showContactListSelect, setShowContactListSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedContactList, setSelectedContactList] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Set timeout to allow the DOM to update before adding visible class
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
      fetchParentCampaigns();
      fetchContactLists();
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const fetchParentCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const campaigns = await getParentCampaigns();
      setParentCampaigns(campaigns);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching parent campaigns:", err);
      setError("Failed to load parent campaigns. Please try again.");
      setLoading(false);
    }
  };

  const fetchContactLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const lists = await getContactLists();
      setContactLists(lists);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contact lists:", err);
      setError("Failed to load contact lists. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFollowUpCampaign({
      ...followUpCampaign,
      [name]: value
    });
  };

  const handleSave = () => {
    // Convert month name to month number (1-12)
    const getMonthNumber = (monthName) => {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return months.indexOf(monthName) + 1; // +1 because months are 1-indexed (January = 1)
    };

    // Create the correct payload structure for the API
    const payload = {
      campaign: followUpCampaign.campaign, // Parent campaign ID
      market: followUpCampaign.market,
      month: getMonthNumber(followUpCampaign.month), // Convert to number
      title: followUpCampaign.title,
      description: followUpCampaign.description,
      contactListId: followUpCampaign.contactListId,
      status: followUpCampaign.status
    };
    
    onSave(payload);
    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setFollowUpCampaign({
      campaign: '',
      market: '',
      month: '',
      title: '',
      description: '',
      contactListId: '',
      status: 'active'
    });
    setSelectedCampaign(null);
    setSelectedContactList(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
      resetForm();
    }, 400);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setFollowUpCampaign({
      ...followUpCampaign,
      campaign: campaign._id,
      market: campaign.market // Auto-fill market from parent campaign
    });
  };

  const handleContactListSelect = (contactList) => {
    setSelectedContactList(contactList);
    setFollowUpCampaign({
      ...followUpCampaign,
      contactListId: contactList.name // Use the SampleName as contactListId
    });
  };

  // Get list of available months for the dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get list of available status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  // Check if form is valid for submission
  const isFormValid = followUpCampaign.campaign && 
                     followUpCampaign.market && 
                     followUpCampaign.month && 
                     followUpCampaign.title &&
                     followUpCampaign.contactListId;

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay7 ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container7">
        <div className="modal-header7">
          <h2>Create Follow Up Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="error-message" style={{ 
            color: "#d32f2f", 
            backgroundColor: "#ffebee", 
            padding: "10px", 
            margin: "10px", 
            borderRadius: "4px" 
          }}>
            {error}
          </div>
        )}
        
        <div className="modal-content7">
          {/* First row with two fields */}
          <div className="form-row form-row-2col">
            <div className="form-group7">
              <label>Campaign <span style={{ color: 'red' }}>*</span></label>
              <div
                className={`campaign-select-box ${selectedCampaign ? 'selected' : ''}`}
                onClick={() => setShowCampaignSelect(true)}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "10px", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "6px", 
                  cursor: "pointer" 
                }}
              >
                <div className="campaign-select-icon" style={{ marginRight: "8px" }}>
                  <Search size={18} />
                </div>
                <span>{selectedCampaign ? selectedCampaign.name : 'Select Campaign'}</span>
              </div>
            </div>

            <div className="form-group7">
              <label>Markets <span style={{ color: 'red' }}>*</span></label>
              <div className="select-wrapper7">
                <select
                  name="market"
                  value={followUpCampaign.market}
                  onChange={handleChange}
                >
                  <option value="">select...</option>
                  <option value="Houston - TX">Houston - TX</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="California">California</option>
                </select>
                <ChevronDown size={16} className="select-icon7" />
              </div>
            </div>
          </div>

          {/* Second row with two fields */}
          <div className="form-row form-row-2col">
            <div className="form-group7">
              <label className="info-label">
                Select Month Without Response <span style={{ color: 'red' }}>*</span>
                <Info size={16} className="info-icon" title="Select the month when prospects didn't respond" style={{ marginLeft: "5px" }} />
              </label>
              <div className="select-wrapper7">
                <select
                  name="month"
                  value={followUpCampaign.month}
                  onChange={handleChange}
                >
                  <option value="">Select month...</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon7" />
              </div>
            </div>

            <div className="form-group7">
              <label className="info-label">
                Follow up Campaign Title <span style={{ color: 'red' }}>*</span>
                <Info size={16} className="info-icon" title="Name for your follow-up campaign" style={{ marginLeft: "5px" }} />
              </label>
              <input
                type="text"
                placeholder="Enter your follow up campaign title"
                name="title"
                value={followUpCampaign.title}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Third row for contact list selection */}
          <div className="form-row">
            <div className="form-group7">
              <label>Contact List <span style={{ color: 'red' }}>*</span></label>
              <div
                className={`campaign-select-box ${selectedContactList ? 'selected' : ''}`}
                onClick={() => setShowContactListSelect(true)}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "10px", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "6px", 
                  cursor: "pointer" 
                }}
              >
                <div className="campaign-select-icon" style={{ marginRight: "8px" }}>
                  <Search size={18} />
                </div>
                <span>{selectedContactList ? selectedContactList.name : 'Select Contact List'}</span>
              </div>
            </div>
          </div>

          {/* Fourth row for description (optional) */}
          <div className="form-row">
            <div className="form-group7">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={followUpCampaign.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={!isFormValid}
            style={{
              opacity: isFormValid ? 1 : 0.6,
              cursor: isFormValid ? 'pointer' : 'not-allowed'
            }}
          >
            Save 
          </button>
        </div>
      </div>

      {/* Nested Campaign Selection Modal */}
      <SelectCampaignModal 
        isOpen={showCampaignSelect}
        onClose={() => setShowCampaignSelect(false)}
        onSelect={handleCampaignSelect}
        campaigns={parentCampaigns}
      />

      {/* Nested Contact List Selection Modal */}
      <SelectContactListModal 
        isOpen={showContactListSelect}
        onClose={() => setShowContactListSelect(false)}
        onSelect={handleContactListSelect}
        contactLists={contactLists}
      />
    </div>
  );
};

export default CreateFollowUpModal;