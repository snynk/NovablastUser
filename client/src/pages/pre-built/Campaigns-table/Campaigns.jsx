import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import "@/assets/css/campaings.css";

// Import the modal components
import CreateCampaignModal from "./CreateCampaignModal";
import CreateFollowUpModal from "./CreateFollowUpModal";

const CampaignManagement = () => {
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Statewide abstee non LLC owners',
      market: 'Houston - TX',
      sent: 2142,
      remaining: 1718,
      hot: 29,
      drip: 0,
      deliverability: '95.80%',
      response: '24.22%',
      created: '4/12/2025'
    },
    {
      id: 2,
      name: '1,000 leads sms blast OC + ...',
      market: 'North Carolina',
      sent: 4142,
      remaining: 3047,
      hot: 59,
      drip: 0,
      deliverability: '95.51%',
      response: '15.70%',
      created: '4/9/2025'
    }
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const handleSaveNewCampaign = (campaignData) => {
    console.log('New campaign data:', campaignData);
    setShowNewCampaignModal(false);
  };

  const handleSaveFollowUp = (followUpData) => {
    console.log('Follow up campaign data:', followUpData);
    setShowFollowUpModal(false);
  };

  return (
    <>
      {/* Moved outside of campaign-container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h1 
    className="dashboard-title" 
    style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '100px 20px 10px' }}
  >
    Campaigns
  </h1>
  <div 
    style={{ 
      height: '4px', 
      width: '100px', 
      backgroundColor: '#22c55e', // green-500
      borderRadius: '9999px',
      marginLeft: '20px'
    }} 
  />
</div>
      <header className="header">
        <div className="header-buttons">
          <button
            className="create-user-button create-button"
            onClick={() => setShowNewCampaignModal(true)}
          >
            Create New Campaign
          </button>
          <button
            className="create-user-button create-button"
            onClick={() => setShowFollowUpModal(true)}
          >
            Create New Follow Up Campaign
          </button>
        </div>
      </header>

      <div className="campaign-container">
        <div className="search-filter">
          <div className="search-wrapper">
            <input type="text" placeholder="Search for a Campaign" className="search-input3" />
          </div>
          <button className="filter-button">Show only Follow Ups</button>
        </div>

        <div className="table-container">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th className="campaign-name">Campaign Name</th>
                <th>Market</th>
                <th>Sent</th>
                <th>Remaining</th>
                <th>Hot</th>
                <th>Drip</th>
                <th>Deliverability</th>
                <th>Response</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="campaign-name">{campaign.name}</td>
                  <td>{campaign.market}</td>
                  <td>
                    <span className="dot green"></span> {campaign.sent}
                  </td>
                  <td>{campaign.remaining}</td>
                  <td>{campaign.hot}</td>
                  <td>
                    <span className="dot green"></span> {campaign.drip}
                  </td>
                  <td>
                    <span className="dot green"></span> {campaign.deliverability}
                  </td>
                  <td>{campaign.response}</td>
                  <td className={campaign.id === 2 ? 'date' : ''}>{campaign.created}</td>
                  <td>
                  <div className="actions-cell">
                    <button className="icon-button">
                      <span className="edit-icon">✏️</span>
                    </button>
                    <button className="icon-button">
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="total-entries">Total: 2</div>
          <div className="pagination-controls">
            <button className="pagination-button"><ChevronsLeft size={16} /></button>
            <button className="pagination-button"><ChevronLeft size={16} /></button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button"><ChevronRight size={16} /></button>
            <button className="pagination-button"><ChevronsRight size={16} /></button>
          </div>
          <div className="entries-selector">
            <span>Entries</span>
            <div className="dropdown">
              <span>{entriesPerPage}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateCampaignModal
          isOpen={showNewCampaignModal}
          onClose={() => setShowNewCampaignModal(false)}
          onSave={handleSaveNewCampaign}
        />
        <CreateFollowUpModal
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          onSave={handleSaveFollowUp}
        />
      </div>
    </>
  );
};

export default CampaignManagement;
