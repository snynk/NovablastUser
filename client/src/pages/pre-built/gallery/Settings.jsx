import React, { useState } from 'react';
import "@/assets/css/settings.css";

// Modal Base Component
const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`modal-overlay5 ${className}`}>
      <div className="modal-container5">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Request New Market Modal Component
const RequestNewMarketModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request New Market" className="modal-5">
      {/* <div className="info-banner">
        <span className="info-icon">ℹ️</span>
        <p>Please note that this number/user will be charged according to your current subscription</p>
        <button className="accept-button">Accept</button>
      </div> */}
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Market Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Name" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Call Forwarding Number <span className="required">*</span></label>
          <div className="phone-input">
            <div className="country-code">
              {/* <span className="flag">🇺🇸</span>
              <span>+1</span> */}
            </div>
            <input type="text" className="form-input" />
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Area Code <span className="required">*</span></label>
          <div className="select-container">
            <input type="text" className="form-input" placeholder="Search..." />
            {/* <span className="dropdown-icon">▼</span> */}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Time Zone</label>
          <input type="text" className="form-input" disabled />
        </div>
      </div>
      
      <div className="modal-footer">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="save-button">Save</button>
      </div>
    </Modal>
  );
};

// 10 DLC Form Modal Component
const DlcFormModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registration Info" className="modal-6">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Market Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Market Name" />
        </div>
        
        <div className="form-group">
          <label className="form-label">What Type of legal form is the org? <span className="required">*</span></label>
          <div className="select-container">
            <input type="text" className="form-input" placeholder="Sole proprietorship:" readOnly />
            {/* <span className="dropdown-icon">▼</span> */}
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tax Number / ID / EIN <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Ein" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Website URL <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter URL" />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter First Name" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Last Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Last Name" />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">DBA or Brand Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Name" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email <span className="required">*</span></label>
          <input type="email" className="form-input" placeholder="Enter Email" />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Vertical type</label>
          <div className="select-container">
            <input type="text" className="form-input" placeholder="Select" readOnly />
            {/* <span className="dropdown-icon">▼</span> */}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">ZIP <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter ZIP" />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone Number <span className="required">*</span></label>
          <div className="phone-input">
            <div className="country-code">
              <span className="flag">🇺🇸</span>
              <span>+1</span>
            </div>
            <input type="text" className="form-input" />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">State <span className="required">*</span></label>
          <div className="phone-input">
            <div className="country-code">
              <span className="flag">🇺🇸</span>
            </div>
            <input type="text" className="form-input" placeholder="Enter State" />
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="submit-button">Submit</button>
      </div>
    </Modal>
  );
};
const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isDlcFormOpen, setIsDlcFormOpen] = useState(false);
  
  const tabs = [
    { id: 'markets', label: 'Markets & Limits' },
    { id: 'dnc', label: 'Do Not Calls' },
    { id: 'tags', label: 'Tags' },
    { id: 'export', label: 'Export Prospects' },
    { id: 'integrations', label: 'Integrations' },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'markets':
        return <MarketsTabContent 
                  onOpenMarketModal={() => setIsMarketModalOpen(true)} 
                  onOpenDlcForm={() => setIsDlcFormOpen(true)} 
                />;
      case 'dnc':
        return <DoNotCallsTabContent />;
      case 'tags':
        return <TagsTabContent />;
      case 'export':
        return <ComingSoonTabContent feature="Export Prospects" />;
      case 'integrations':
        return <ComingSoonTabContent feature="Integrations" />;
      default:
        return <div className="tab-content-placeholder"></div>;
    }
  };
  
  return (
    <div className="settings-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 
          className="dashboard-title" 
          style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 10px 0' }}
        >
          Settings
        </h1>
        <div 
          style={{ 
            height: '4px', 
            width: '6%',
            backgroundColor: '#22c55e', // Green color
          }} 
        />
      </div>      
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {renderTabContent()}
      
      {/* Modals */}
      <RequestNewMarketModal 
        isOpen={isMarketModalOpen} 
        onClose={() => setIsMarketModalOpen(false)} 
      />
      
      <DlcFormModal 
        isOpen={isDlcFormOpen} 
        onClose={() => setIsDlcFormOpen(false)} 
      />
    </div>
  );
};

// Coming Soon Tab Content Component
const ComingSoonTabContent = ({ feature }) => {
  return (
    <div className="tab-content" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div className="coming-soon-container">
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚧</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          {feature} Coming Soon
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

const MarketsTabContent = ({ onOpenMarketModal, onOpenDlcForm }) => {
  const markets = [
    { 
      id: 1, 
      name: 'Houston - TX 832', 
      sentToday: 0, 
      sentThisMonth: 3560, 
      callForwardingNumber: '18327392869', 
      status: 'Accepted' 
    },
    { 
      id: 2, 
      name: 'North Carolina-919', 
      sentToday: 0, 
      sentThisMonth: 7189, 
      callForwardingNumber: '18327392868', 
      status: 'Accepted' 
    }
  ];

  return (
    <div className="tab-content">
      <div className="filters-row">
        <div className="filter-dropdown">
          <select className="filter-select">
            <option>Market</option>
          </select>
        </div>
        <div className="filter-dropdown">
          <select className="filter-select">
            <option>Area code</option>
          </select>
        </div>
        <div className="spacer"></div>
        <button className="create-button create-user-button" onClick={onOpenDlcForm}>10 DLC Form</button>
        <button className="create-button create-user-button" onClick={onOpenMarketModal}><span className="plus">+</span>Request New Market</button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable">Market Name</th>
              <th className="sortable">
                Sent Today
                <div className="sent-today-label">0.00%</div>
              </th>
              <th className="sortable">
                Sent This Month
                <div className="sent-month-label">36.83%</div>
              </th>
              <th className="sortable">Call Forwarding Number</th>
              <th className="sortable">Registration Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(market => (
              <tr key={market.id}>
                <td>
                  <div className="expandable-row">
                    <span className="expand-icon">▾</span>
                    {market.name}
                  </div>
                </td>
                <td>{market.sentToday}</td>
                <td>{market.sentThisMonth}</td>
                <td>{market.callForwardingNumber}</td>
                <td>
                  <span className="status-badge accepted">{market.status}</span>
                </td>
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
        <div className="pagination-info">Total: 2</div>
        <div className="pagination-controls">
          <button className="pagination-button">«</button>
          <button className="pagination-button">‹</button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">›</button>
          <button className="pagination-button">»</button>
        </div>
        <div className="pagination-entries">
          Entries
          <select className="entries-select">
            <option>10</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const DoNotCallsTabContent = () => {
  const dncEntries = [
    { id: 1, phone: '+1 (219) 516-2858', firstName: 'Rosie', lastName: 'Blakely', permanent: 'Yes' },
    { id: 2, phone: '+1 (219) 412-4746', firstName: 'Verenice', lastName: 'Corona', permanent: 'Yes' },
    { id: 3, phone: '+1 (708) 653-2614', firstName: 'Antoine', lastName: 'Johnson', permanent: 'Yes' },
    { id: 4, phone: '+1 (219) 880-9577', firstName: 'Cindy', lastName: 'Bonham', permanent: 'Yes' },
    { id: 5, phone: '+1 (773) 255-7102', firstName: 'Earl', lastName: 'Welch', permanent: 'Yes' },
    { id: 6, phone: '+1 (219) 682-5544', firstName: 'Rita', lastName: 'Ward', permanent: 'Yes' },
    { id: 7, phone: '+1 (504) 559-1796', firstName: 'Stephen', lastName: 'Mitchell', permanent: 'Yes' },
    { id: 8, phone: '+1 (219) 577-4424', firstName: 'Richard', lastName: 'Shirley', permanent: 'Yes' },
    { id: 9, phone: '+1 (219) 588-4604', firstName: 'Jimmie', lastName: 'Cathran', permanent: 'Yes' },
    { id: 10, phone: '+1 (219) 730-3279', firstName: 'Dontaye', lastName: 'Bates', permanent: 'Yes' }
  ];

  return (
    <div className="tab-content">
      <div className="filters-row">
        <div className="search-container">
          <input type="text" placeholder="Search for a user" className="search-input" />
        </div>
        <button className="secondary-button">Export To Excel</button>
        <div className="spacer"></div>
        <button className="create-button create-user-button">
          <span className="plus">+</span> Create New DNC
        </button>
        <button className="create-button create-user-button">
          <span className="plus">+</span> Import New DNC
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable">Mobile number</th>
              <th className="sortable">First Name</th>
              <th className="sortable">Last Name</th>
              <th className="sortable">Permanent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dncEntries.map(entry => (
              <tr key={entry.id}>
                <td>
                  <div className="phone-number">
                    <span className="flag-icon">🇺🇸</span> {entry.phone}
                  </div>
                </td>
                <td>{entry.firstName}</td>
                <td>{entry.lastName}</td>
                <td>
                  <span className="permanent-badge">{entry.permanent}</span>
                </td>
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
        <div className="pagination-info">Total: 2</div>
        <div className="pagination-controls">
          <button className="pagination-button">«</button>
          <button className="pagination-button">‹</button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">›</button>
          <button className="pagination-button">»</button>
        </div>
        <div className="pagination-entries">
          Entries
          <select className="entries-select">
            <option>10</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const TagsTabContent = () => {
  const tags = [
    { id: 1, name: 'Expired', color: '#FF3B30', prospects: 0, created: '4/9/2025' },
    { id: 2, name: 'Not Interested', color: '#8E6540', prospects: 0, created: '4/1/2025' },
    { id: 3, name: 'Warm Push', color: '#FF9500', prospects: 0, created: '4/1/2025' },
    { id: 4, name: 'Sold', color: '#5856D6', prospects: 0, created: '4/1/2025' },
    { id: 5, name: 'Cold Push', color: '#2196F3', prospects: 0, created: '4/1/2025' },
    { id: 6, name: 'No Status', color: '#8E8E93', prospects: 0, created: '4/1/2025' },
    { id: 7, name: 'Pushd Lead', color: '#C644FC', prospects: 0, created: '3/15/2025' },
    { id: 8, name: 'Verified & Vegan', color: '#B6CBE3', prospects: 0, created: '4/1/2025' },
    { id: 9, name: 'Under Contract', color: '#FF9F85', prospects: 0, created: '4/1/2025' },
    { id: 10, name: 'Wrong Number', color: '#0D5257', prospects: 0, created: '4/1/2025' },
    { id: 11, name: 'Hot Push', color: '#FFCC00', prospects: 0, created: '4/1/2025' },
    { id: 12, name: 'Warm Agent', color: '#0066CC', prospects: 0, created: '4/1/2025' },
    { id: 13, name: 'Listed', color: '#5BD75B', prospects: 0, created: '4/1/2025' }
  ];

  return (
    <div className="tab-content">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable">Tag</th>
              <th className="sortable">Prospects</th>
              <th className="sortable">Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td>
                  <div className="tag-cell">
                    <span className="tag-badge" style={{ backgroundColor: tag.color }}>
                      {tag.name}
                    </span>
                  </div>
                </td>
                <td>{tag.prospects}</td>
                <td>{tag.created}</td>
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
      
      <div className="add-tag-container">
        <button className="add-tag-button">
          <span className="plus-icon">+</span> Add New Tag
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;