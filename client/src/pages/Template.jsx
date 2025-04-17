import React, { useState } from 'react';
import "@/assets/css/template.css";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical } from 'lucide-react';
// Import the TemplateCreationModal component
// import TemplateCreationModal from './TemplateCreationModal';

const TemplatesManagement = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const [currentPage, setCurrentPage] = useState(1);
  // Add state to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const templateData = [
    {
      name: "4",
      message: <>Hi there! I'm reaching out about <span className="property-address">{'{PropertyAddress}'}</span>. Would you be open to reviewing a <span className="proposal-text">{'{Proposal? /Proposal!/Proposal}'}</span> Reply with "yes" or "no" to stop all messages. Thanks<span className="proposal-text">{': Marcy/Marcy/, Marcy'}</span></>,
      type: "Residential",
      delivery: "95.98%",
      response: "16.77%",
      date: "4/9/2025"
    },
    {
      name: "3",
      message: <><span className="proposal-text">{'{Hey!/Hi/Hello}'}</span> there I'm reaching out about <span className="property-address">{'{PropertyAddress}'}</span> would you be open to reviewing a <span className="proposal-text">{'{offer /offer letter / offer?}'}</span> Reply with "yes" or "no" to stop all messages Thanks Marcy</>,
      type: "Residential",
      delivery: "95.88%",
      response: "19.12%",
      date: "4/9/2025"
    },
    {
      name: "2",
      message: <><span className="proposal-text">{'{Hey!/Hi/Hello}'}</span> there I'm reaching out about <span className="property-address">{'{PropertyAddress}'}</span> would you be able to reviewing a <span className="proposal-text">{'{proposal? /proposal!/proposal}'}</span> Reply with "yes" or "no" to stop all messages Thanks Marcy</>,
      type: "Residential",
      delivery: "95.05%",
      response: "17.41%",
      date: "4/9/2025"
    }
  ];

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle template creation
  const handleCreateTemplate = (templateData) => {
    console.log('New template created:', templateData);
    // Here you would typically add the new template to your state or send to API
    setIsModalOpen(false);
  };

  return (
    <div className="templates-container">
      <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 20px 0'}}>Templates</h1>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          onClick={() => setActiveTab('initial')}
          className={`tab-button ${activeTab === 'initial' ? 'active' : ''}`}
        >
          Initial Messages
        </button>
        <button 
          onClick={() => setActiveTab('quick')}
          className={`tab-button ${activeTab === 'quick' ? 'active' : ''}`}
        >
          Quick Replies
        </button>
        <button 
          onClick={() => setActiveTab('followup')}
          className={`tab-button ${activeTab === 'followup' ? 'active' : ''}`}
        >
          Follow Up Messages
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search initial template"
            className="search-input"
          />
        </div>
        
        <div className="right-filters">
          <span className="category-label">Template category</span>
          <div className="select-container">
            <select className="category-select">
              <option>All</option>
            </select>
            <ChevronDown className="select-icon" />
          </div>
          
          <button className="create-button" onClick={handleOpenModal}>
            Create New
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="table-container">
        <table className="templates-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <span>Name</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Messages</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Type</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Delivery %</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Response %</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>Date</span>
                  <div className="sort-icons">
                    <ChevronUp className="sort-icon" />
                    <ChevronDown className="sort-icon" />
                  </div>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {templateData.map((template, index) => (
              <tr key={index}>
                <td className="name-cell">{template.name}</td>
                <td className="message-cell">
                  <div className="message-content">
                    <div className="message-text">{template.message}</div>
                    <ChevronDown className="expand-icon" />
                  </div>
                </td>
                <td>{template.type}</td>
                <td>{template.delivery}</td>
                <td>{template.response}</td>
                <td>{template.date}</td>
                <td className="action-cell">
                  <button className="action-button">
                    <MoreVertical className="more-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="pagination-container">
          <div className="total-info">
            Total: <span>6</span>
          </div>
          
          <div className="pagination-controls">
            <button className="pagination-button">
              <ChevronsLeft className="pagination-icon" />
            </button>
            <button className="pagination-button">
              <ChevronLeft className="pagination-icon" />
            </button>
            <button className="pagination-button active">
              1
            </button>
            <button className="pagination-button">
              <ChevronRight className="pagination-icon" />
            </button>
            <button className="pagination-button">
              <ChevronsRight className="pagination-icon" />
            </button>
          </div>
          
          <div className="entries-selector">
            <span>Entries</span>
            <div className="entries-select-container">
              <select className="entries-select">
                <option>50</option>
              </select>
              <ChevronDown className="entries-select-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <TemplateCreationModal 
          onClose={handleCloseModal}
          onSubmit={handleCreateTemplate}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default TemplatesManagement;