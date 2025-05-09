import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown, Search } from 'lucide-react';
import { getParentCampaigns } from '../../../services/campaignService';

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
      className={`modal-overlay9 campaign-select-modal ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
      style={{ zIndex: 1100 }} // Higher z-index than parent modal
    >
      <div className="modal-container9" onClick={e => e.stopPropagation()}>
        <div className="modal-header9">
          <h2>Select A Campaign</h2>
          <button className="close-button9" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content9">
          <div className="search-campaign-wrapper9">
            <Search size={20} className="search-campaign-icon9" />
            <input 
              type="text" 
              placeholder="Search Campaigns" 
              className="search-campaign-input9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <p className="campaign-select-description9">
            Select a parent campaign to create a follow-up for prospects who haven't responded
          </p>
          
          <div className="campaign-table-container9">
            <table className="campaign-select-table9">
              <thead>
                <tr>
                  <th className="campaign-name-col9">Name</th>
                  <th className="prospects-col9">Prospects Available</th>
                  <th className="actions-col9">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map(campaign => (
                    <tr key={campaign._id}>
                      <td className="campaign-name-col9">{campaign.name}</td>
                      <td className="prospects-col9">{campaign.sent - campaign.hot || 0}</td>
                      <td className="actions-col9">
                        <button 
                          className="create-user-button create-button select-campaign-button9"
                          onClick={() => handleSelect(campaign)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data9">
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

const CreateFollowUpModal = ({ isOpen, onClose, onSave }) => {
  const [followUpCampaign, setFollowUpCampaign] = useState({
    campaign: '',
    market: '',
    month: '',
    title: ''
  });
  const [parentCampaigns, setParentCampaigns] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Set timeout to allow the DOM to update before adding visible class
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
      fetchParentCampaigns();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFollowUpCampaign({
      ...followUpCampaign,
      [name]: value
    });
  };

  const handleSave = () => {
    // Create the correct payload structure for the API
    const payload = {
      campaign: followUpCampaign.campaign, // Parent campaign ID
      market: followUpCampaign.market,
      month: followUpCampaign.month,
      title: followUpCampaign.title
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
      title: ''
    });
    setSelectedCampaign(null);
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

  // Get list of available months for the dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Check if form is valid for submission
  const isFormValid = followUpCampaign.campaign && 
                     followUpCampaign.market && 
                     followUpCampaign.month && 
                     followUpCampaign.title;

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <div className="modal-header">
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
        
        <div className="modal-content9">
          <div className="form-group">
            <label>Campaign <span style={{ color: 'red' }}>*</span></label>
            <div
              className={`campaign-select-box ${selectedCampaign ? 'selected' : ''}`}
              onClick={() => setShowCampaignSelect(true)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              <div className="campaign-select-icon">
                <Search size={18} />
              </div>
              <span>{selectedCampaign ? selectedCampaign.name : 'Select Campaign'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Markets <span style={{ color: 'red' }}>*</span></label>
            <div className="select-wrapper">
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
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="info-label">
              Select Month Without Response <span style={{ color: 'red' }}>*</span>
              <Info size={16} className="info-icon" title="Select the month when prospects didn't respond" />
            </label>
            <div className="select-wrapper">
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
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="info-label">
              Follow up Campaign Title <span style={{ color: 'red' }}>*</span>
              <Info size={16} className="info-icon" title="Name for your follow-up campaign" />
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
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="follow-up-save-button create-user-button create-button" 
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
    </div>
  );
};

export default CreateFollowUpModal;