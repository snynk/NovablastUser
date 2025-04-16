  import React, { useState } from 'react';
  import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
  import "@/assets/css/campaings.css";

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

    return (
      <div className="campaign-container">
      <h1 className="dashboard-title">Campaigns</h1>
        <header className="header">
          <div className="header-buttons">
            <button className="create-button">Create New Campaign</button>
            <button className="create-button">Create New Follow Up Campaign</button>
          </div>
        </header>

        <div className="search-filter">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search for a Campaign" className="search-input" />
          </div>
          <button className="filter-button">
            Show only Follow Ups
          </button>
        </div>

        <div className="table-container">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th className="campaign-name">Campaign Name</th>
                <th>Market</th>
                <th>Sent</th>
                <th>Remaining</th>
                <th>
                  Hot
                  {/* <span className="info-icon">i</span> */}
                </th>
                <th>
                  Drip
                  {/* <span className="info-icon">i</span> */}
                </th>
                <th>
                  Deliverability
                  {/* <span className="info-icon">i</span> */}
                </th>
                <th>
                  Response
                  {/* <span className="info-icon">i</span> */}
                </th>
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
                    <button className="action-button">
                      <MoreVertical size={18} />
                    </button>
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
      </div>
    );
  };

  export default CampaignManagement;