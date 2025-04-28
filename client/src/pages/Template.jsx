import React, { useState } from 'react';
import "@/assets/css/template.css";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical, X, Smile } from 'lucide-react';

const TemplatesManagement = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalMessage, setActiveModalMessage] = useState(1);
  const [messageContent, setMessageContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('Residential');
  const [totalVariations, setTotalVariations] = useState(0);
  
  // Template Data (keeping your original data)
  const initialTemplateData = [
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

  // Quick Replies Tab Data
  const quickRepliesData = [
    {
      id: "1",
      title: "No worries when would be a good time to touch base?",
      category: "My templates1",
      message: "No worries when would be a good time to touch base?"
    }
  ];

  // Follow Up Messages Tab Data
  const followUpData = [
    {
      name: "Template 1",
      message: <>[Hi/Hello/Hey] {'{FirstName}'}, {'{AliasRepName}'} at {'{CompanyName}'}. We're [keen on/open in/focused on] houses like {'{PropertyAddress}'} for our next project. [Wondering/Thinking/Contemplating] if a sale has crossed your mind? Let's talk.</>,
      type: "Residential",
      delivery: "0.00%",
      response: "0.00%",
      date: "4/9/2025"
    },
    {
      name: "Template 2",
      message: <>[Hi/Hello/Hey] {'{FirstName}'}, {'{AliasRepName}'} with {'{CompanyName}'}. We're on the lookout to embrace homes into our portfolio and would be delighted to consider {'{PropertyAddress}'} with an easygoing proposal. [Think this fits your plans/See an opportunity here/Wonder about the possibilities]?</>,
      type: "Commercial",
      delivery: "0.00%",
      response: "0.00%",
      date: "4/9/2025"
    }
  ];

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setActiveModalMessage(1);
    setTemplateType('Residential');
    setTemplateName('');
    setMessageContent('');
    setTotalVariations(0);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle template creation
  const handleCreateTemplate = () => {
    console.log('New template created:', {
      name: templateName,
      type: templateType,
      message: messageContent
    });
    // Here you would typically add the new template to your state or send to API
    setIsModalOpen(false);
  };

  // Function to handle next message
  const handleNextMessage = () => {
    setActiveModalMessage(prev => prev + 1);
  };

  // Function to handle back action
  const handleBack = () => {
    if (activeModalMessage > 1) {
      setActiveModalMessage(prev => prev - 1);
    }
  };

  // Function to switch between message tabs in modal
  const handleMessageTabChange = (messageNum) => {
    setActiveModalMessage(messageNum);
  };

  // Function to add a text spinner
  const handleAddTextSpinner = () => {
    const updatedContent = messageContent + '{option1/option2/option3}';
    setMessageContent(updatedContent);
    calculateVariations(updatedContent);
  };

  // Function to add a merge field
  const handleAddMergeField = () => {
    const updatedContent = messageContent + '{PropertyAddress}';
    setMessageContent(updatedContent);
    calculateVariations(updatedContent);
  };

  // Function to calculate variations
  const calculateVariations = (content) => {
    // Simple logic to count variations based on spinners
    const matches = content.match(/\{[^{}]*\/[^{}]*\}/g) || [];
    if (matches.length === 0) {
      setTotalVariations(0);
      return;
    }
    
    let totalVars = 1;
    matches.forEach(match => {
      const options = match.slice(1, -1).split('/');
      totalVars *= options.length;
    });
    
    setTotalVariations(totalVars);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'initial':
        return (
          <>
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search initial template"
                  className="search-input"
                />
                {/* <Search className="search-icon" /> */}
              </div>
              
              <div className="right-filters">
                <span className="category-label">Template category</span>
                <div className="select-container">
                  <select className="category-select">
                    <option>All</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
                
                <button className="create-button create-user-button" onClick={handleOpenModal}>
                  Create New
                </button>
              </div>
            </div>
            
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
                    <th>
                      <div className="th-content">
                        <span>Action</span>
                        <div className="sort-icons">
                          <ChevronUp className="sort-icon" />
                          <ChevronDown className="sort-icon" />
                        </div>
                      </div>
                    </th>                  </tr>
                </thead>
                <tbody>
                  {initialTemplateData.map((template, index) => (
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
          </>
        );
        
      case 'quick':
        return (
          <>
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search quick reply"
                  className="search-input"
                />
                {/* <Search className="search-icon" /> */}
              </div>
              
              <div className="right-filters">
                <span className="category-label">Template Type</span>
                <div className="select-container">
                  <select className="category-select">
                    <option>My templates1</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
                
                <button className="create-button" onClick={handleOpenModal}>
                  Create New
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="templates-table quick-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quickRepliesData.map((template, index) => (
                    <tr key={index}>
                      <td>{template.id}</td>
                      <td>{template.title}</td>
                      <td>{template.category}</td>
                      <td>{template.message}</td>
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
              
              <div className="pagination-container">
                <div className="total-info">
                  Total: <span>1</span>
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
          </>
        );
        
      case 'followup':
        return (
          <>
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search follow up template"
                  className="search-input"
                />
                {/* <Search className="search-icon" /> */}
              </div>
              
              <div className="right-filters">
                <span className="category-label">Template category</span>
                <div className="select-container">
                  <select className="category-select">
                    <option>All (2)</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
                
                <button className="create-button" onClick={handleOpenModal}>
                  Create New
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="templates-table follow-up-table">
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
                  {followUpData.map((template, index) => (
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
              
              <div className="pagination-container">
                <div className="total-info">
                  Total: <span>2</span>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="templates-container">
   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h1 
    className="dashboard-title" 
    style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 10px 0' }}
  >
    Templates
  </h1>
  <div 
    style={{ 
      height: '4px', 
      width: '100px', 
      backgroundColor: '#22c55e', // Tailwind's green-500
      borderRadius: '9999px',
    }} 
  />
</div>

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
      
      {/* Tab Content */}
      {renderTabContent()}
      
      {/* Create Template Modal */}
      {isModalOpen && (
        <div className="modal-overlay2">
          <div className="modal-container2">
            <div className="modal-header">
              <h2>Create Initial Template</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="templateName">
                      Template Name <span className="info-icon">i</span>
                    </label>
                    <input 
                      type="text" 
                      id="templateName" 
                      placeholder="Enter Template Name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="templateType">
                      Template Type <span className="info-icon">i</span>
                    </label>
                    <div className="select-wrapper">
                      <select 
                        id="templateType" 
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      <ChevronDown className="select-icon" />
                    </div>
                  </div>
                </div>
                
                <div className="template-description">
                  Kickstart conversations with a variety of motivated sellers
                </div>
                
                <div className="messages-section">
                  <div className="messages-header">
                    <h3>Messages</h3>
                    <div className="messages-help">
                      Follow our Best Practices to build high-converting content
                      <span className="toggle-keywords">
                        Negative Keywords <ChevronUp />
                      </span>
                    </div>
                  </div>
                  
                  <div className="message-tabs">
                    <div className={`message-tab ${activeModalMessage === 1 ? 'active' : ''}`}>
                      <span className="message-number">1</span>
                      <span className="message-label">Message 1</span>
                    </div>
                    {Array.from({length: 4}, (_, i) => i + 2).map(num => (
                      <div 
                        key={num}
                        className={`message-tab ${activeModalMessage === num ? 'active' : ''}`}
                        onClick={() => handleMessageTabChange(num)}
                      >
                        <span className="message-number">{num}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="message-editor">
                    <textarea
                      placeholder="Write your message"
                      value={messageContent}
                      onChange={(e) => {
                        setMessageContent(e.target.value);
                        calculateVariations(e.target.value);
                      }}
                    />
                    <div className="message-footer">
                      <div className="character-count">0 / 320</div>
                      <div className="message-actions">
                        <button className="emoji-button">
                          <Smile size={18} />
                        </button>
                        <button className="text-spinner-button" onClick={handleAddTextSpinner}>
                          Add Text Spinner
                        </button>
                        <button className="merge-field-button" onClick={handleAddMergeField}>
                          Add Merge Field
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="message-validation">
                    <div className="validation-header">
                      <h4>Message 1</h4>
                      <div className="variations-count">Variations: {totalVariations}</div>
                    </div>
                    
                    <ul className="validation-rules">
                      <li className="rule">
                        <span className="checkmark">✓</span>
                        Minimum of 8 characters
                      </li>
                      <li className="rule">
                        <span className="circle">○</span>
                        At least 2 Text Spinners [0/2]
                      </li>
                      <li className="rule">
                        <span className="circle">○</span>
                        Each Text Spinner must have at least 3 elements
                      </li>
                      <li className="rule">
                        <span className="circle">○</span>
                        Must have Merge Field
                      </li>
                      <li className="rule">
                        <span className="checkmark">✓</span>
                        Must have no negative/restricted keywords
                      </li>
                      <li className="rule">
                        <span className="checkmark">✓</span>
                        All Merge Fields and Text Spinners must be valid
                      </li>
                    </ul>
                    
                    <div className="additional-messages">
                      <div className="message-preview">Message 2</div>
                      <div className="message-preview">Message 3</div>
                      <div className="message-preview">Message 4</div>
                      <div className="message-preview">Message 5</div>
                    </div>
                    
                    <div className="total-variations">
                      Total Variations: {totalVariations}
                    </div>
                  </div> */}
                </div>
                
                <div className="modal-actions">
                  <div className="left-actions">
                    <button className="back-button" onClick={handleBack}>
                      Back
                    </button>
                  </div>
                  
                  <div className="variations-count">
                    Total Variations: {totalVariations}
                  </div>
                  
                  <div className="right-actions">
                    <button className="next-message-button" onClick={handleNextMessage}>
                      Next Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="save-button1" onClick={handleCreateTemplate}>
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesManagement;