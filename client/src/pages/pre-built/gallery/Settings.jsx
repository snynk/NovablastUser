import React, { useState } from 'react';
import axios from 'axios';
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


// **Market Management Component**
const MarketsTab = () => {
  const [markets, setMarkets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [formData, setFormData] = useState({ name: '', callForwardingNumber: '', areaCode: '', timeZone: '', status: 'Pending' });

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const { data } = await axios.get('/api/markets/all');
      setMarkets(data);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingMarket) {
        await axios.put(`/api/markets/${editingMarket._id}`, formData);
      } else {
        await axios.post('/api/markets/create', formData);
      }
      fetchMarkets();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving market:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/markets/${id}`);
      fetchMarkets();
    } catch (error) {
      console.error("Error deleting market:", error);
    }
  };

  return (
    <div className="tab-content">
      <button className="create-button" onClick={() => { setEditingMarket(null); setModalOpen(true); }}>+ Add Market</button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Market Name</th>
            <th>Call Forwarding Number</th>
            <th>Area Code</th>
            <th>Time Zone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {markets.map(market => (
            <tr key={market._id}>
              <td>{market.name}</td>
              <td>{market.callForwardingNumber}</td>
              <td>{market.areaCode}</td>
              <td>{market.timeZone}</td>
              <td>{market.status}</td>
              <td>
                <button onClick={() => { setEditingMarket(market); setModalOpen(true); }}>Edit</button>
                <button onClick={() => handleDelete(market._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMarket ? "Edit Market" : "Add Market"}>
          <input type="text" placeholder="Market Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="text" placeholder="Call Forwarding Number" value={formData.callForwardingNumber} onChange={(e) => setFormData({ ...formData, callForwardingNumber: e.target.value })} />
          <input type="text" placeholder="Area Code" value={formData.areaCode} onChange={(e) => setFormData({ ...formData, areaCode: e.target.value })} />
          <input type="text" placeholder="Time Zone" value={formData.timeZone} onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })} />
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleSave}>Save</button>
        </Modal>
      )}
    </div>
  );
};

// **10DLC Form Component**
const DlcFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    businessType: '', taxId: '', websiteUrl: '', brandName: '', email: '',
    firstName: '', lastName: '', verticalType: '', zip: '', phoneNumber: '', state: ''
  });

  const handleSubmit = async () => {
    try {
      await axios.post('/api/tendlc/register', formData);
      onClose();
    } catch (error) {
      console.error("Error submitting 10DLC form:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="10DLC Registration">
      <input type="text" placeholder="Business Type" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} />
      <input type="text" placeholder="Tax ID / EIN" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
      <input type="text" placeholder="Website URL" value={formData.websiteUrl} onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} />
      <input type="text" placeholder="Brand Name" value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} />
      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
      <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
      <input type="text" placeholder="Vertical Type" value={formData.verticalType} onChange={(e) => setFormData({ ...formData, verticalType: e.target.value })} />
      <input type="text" placeholder="ZIP Code" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
      <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
      <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
      <button onClick={handleSubmit}>Submit</button>
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