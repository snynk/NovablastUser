import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown, Search } from 'lucide-react';
// import "./ModalStyles.css";

// New Campaign Selection Modal Component
const SelectCampaignModal = ({ isOpen, onClose, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Gary 11,000 leads sms blast OC + AB non LLC 4/9/25',
      prospects: 776
    },
    {
      id: 2,
      name: 'Statewide abstee non LLC owners',
      prospects: 542
    },
    {
      id: 3,
      name: '1,000 leads sms blast OC',
      prospects: 348
    }
  ]);

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
      className={`modal-overlay campaign-select-modal ${isVisible ? 'visible' : ''}`}
      onClick={handleOverlayClick}
      style={{ zIndex: 1100 }} // Higher z-index than parent modal
    >
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select A Campaign</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
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
            Picking out the campaigns where the people we contacted haven't answered for at least a week
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
                {filteredCampaigns.map(campaign => (
                  <tr key={campaign.id}>
                    <td className="campaign-name-col">{campaign.name}</td>
                    <td className="prospects-col">{campaign.prospects}</td>
                    <td className="actions-col">
                      <button 
                        className="select-campaign-button"
                        onClick={() => handleSelect(campaign)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
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
    campaignName: '',
    market: '',
    month: '',
    title: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);

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
    setFollowUpCampaign({
      ...followUpCampaign,
      [name]: value
    });
  };

  const handleSave = () => {
    onSave(followUpCampaign);
    setFollowUpCampaign({ campaign: '', campaignName: '', market: '', month: '', title: '' });
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

  const handleCampaignSelect = (campaign) => {
    setFollowUpCampaign({
      ...followUpCampaign,
      campaign: campaign.id,
      campaignName: campaign.name
    });
  };

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
        <div className="modal-content">
          <div className="form-group">
            <label>Campaign</label>
            <div
              className={`campaign-select-box ${followUpCampaign.campaignName ? 'selected' : ''}`}
              onClick={() => setShowCampaignSelect(true)}
            >
              <div className="campaign-select-icon">
                <Search size={18} />
              </div>
              <span>{followUpCampaign.campaignName || 'Select Campaign'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Markets</label>
            <div className="select-wrapper">
              <select
                name="market"
                value={followUpCampaign.market}
                onChange={handleChange}
              >
                <option value="">select...</option>
                <option value="Houston - TX">Houston - TX</option>
                <option value="North Carolina">North Carolina</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="info-label">
              Select Month Without Response
              <Info size={16} className="info-icon" />
            </label>
            <div className="select-wrapper">
              <select
                name="month"
                value={followUpCampaign.month}
                onChange={handleChange}
              >
                <option value="">Select month...</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="info-label">
              Follow up Campaign Title
              <Info size={16} className="info-icon" />
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
          <button className="follow-up-save-button" onClick={handleSave}>
            Save Follow Up Campaign
          </button>
        </div>
      </div>

      {/* Nested Campaign Selection Modal */}
      <SelectCampaignModal 
        isOpen={showCampaignSelect}
        onClose={() => setShowCampaignSelect(false)}
        onSelect={handleCampaignSelect}
      />
    </div>
  );
};

export default CreateFollowUpModal;