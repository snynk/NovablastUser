import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, X, Smile, AlertCircle, MessageSquare, Eye
} from 'lucide-react';
import "@/assets/css/template.css";
import { 
  getTemplates, createTemplate, updateTemplate, deleteTemplate, searchTemplates 
} from '../services/templateService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, templateName, onCancel, onConfirm }) => {
  // Prevent scrolling of background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen) {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCancel]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlaydelete" onClick={handleOverlayClick}>
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>Delete Template</h3>
          <button className="close-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="delete-modal-body">
          <div className="warning-icon">
            <AlertCircle size={48} />
          </div>
          <h4>Delete Template?</h4>
          <p className="modal-text">
            Are you sure you want to delete <strong>"{templateName}"</strong>?
          </p>
          <p className="modal-subtext">
            This action cannot be undone.
          </p>
        </div>
        <div className="delete-modal-actions">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="delete-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// View Template Modal Component
const ViewTemplateModal = ({ isOpen, template, onClose }) => {
  if (!isOpen || !template) return null;
  
  return (
    <div className="modal-overlay5 view-modal-overlay5">
      <div className="view-modal1">
        <div className="view-modal-header1">
          <h5>View Template</h5>
          <button className="close-button" onClick={onClose}><X size={18} /></button>
        </div>
        
        <div className="view-modal-content1">
          <div className="view-template-details1">
            <div className="detail-row1">
              <div className="detail-label1">Template Name:</div>
              <div className="detail-value1">{template.name}</div>
            </div>
            
            <div className="detail-row1">
              <div className="detail-label1">Template Type:</div>
              <div className="detail-value1">{template.type}</div>
            </div>
            
            <div className="detail-row1">
              <div className="detail-label1">Template ID:</div>
              <div className="detail-value1">{template._id}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label1">Created Date:</div>
              <div className="detail-value1">{new Date(template.created).toLocaleDateString()}</div>
            </div>
            
            <div className="detail-row1">
              <div className="detail-label1">Performance:</div>
              <div className="detail-value1">
                <span className="performance-stat1">Delivery: {template.delivery?.toFixed(2) || '0.00'}%</span>
                <span className="performance-stat1">Response: {template.response?.toFixed(2) || '0.00'}%</span>
              </div>
            </div>
          </div>
          
          {template.messages && template.messages.length > 0 && (
            <div className="view-template-messages1">
              <h4>Messages</h4>
              <div className="message-list1">
                {template.messages.map((message, index) => (
                  <div key={index} className="message-item1">
                    <div className="message-header1">
                      <div className="message-number1">Message {message.messageNumber}</div>
                    </div>
                    <div className="message-body1">{message.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="view-modal-footer1">
          <button className="close-view-button1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Message Preview Component
const MessagePreview = ({ messages }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!messages || messages.length === 0) {
    return <div className="no-messages">No messages</div>;
  }
  
  return (
    <div className="message-row message-preview-container">
      <div className="message-content">
        <div className="message-text">{messages[0]?.content || 'No message content'}</div>
        <button className="expand-button" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="expand-icon" /> : <ChevronDown className="expand-icon" />}
        </button>
      </div>
      
      {!expanded && messages.length > 1 && (
        <div className="message-count1">
          <MessageSquare size={14} />
          <span>{messages.length} messages</span>
        </div>
      )}
    </div>
  );
};

const TemplatesManagement = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('initial');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState(null);
  const [activeModalMessage, setActiveModalMessage] = useState(1);
  const [messageContents, setMessageContents] = useState({1: '', 2: '', 3: '', 4: '', 5: ''});
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('Residential');
  const [totalVariations, setTotalVariations] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMessageCount, setActiveMessageCount] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    entriesPerPage: 50
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    templateId: null,
    templateName: ''
  });
  // View template modal state
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    template: null
  });
  // Form validation
  const [formErrors, setFormErrors] = useState({
    templateName: '',
    message1: ''
  });
  
  // Fetch templates on component mount and tab change
  useEffect(() => {
    fetchTemplates();
  }, [activeTab]);

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTemplates({ templateType: activeTab });
      setTemplates(data);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(data.length / prev.entriesPerPage),
        currentPage: 1
      }));
    } catch (err) {
      setError('Failed to fetch templates');
      toast.error('Failed to fetch templates. Please check your connection and try again.', {
        toastId: 'fetch-error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle view template
  const handleOpenViewModal = (template) => {
    setViewModal({
      isOpen: true,
      template
    });
  };

  // Handle search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    try {
      if (value.trim()) {
        const data = await searchTemplates(value, activeTab);
        setTemplates(data);
      } else {
        fetchTemplates();
      }
    } catch (err) {
      toast.error('Search failed. Please try again.', {
        toastId: 'search-error'
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {
      templateName: !templateName.trim() ? 'Template name is required' : '',
      message1: !messageContents[1].trim() ? 'Message 1 is required' : ''
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Modal functions
  const handleOpenModal = (template = null) => {
    if (template) {
      // Edit mode
      setIsEditMode(true);
      setEditTemplateId(template._id);
      setTemplateName(template.name);
      setTemplateType(template.type);
      
      // Set message contents
      const newMessageContents = { ...messageContents };
      template.messages.forEach(msg => {
        newMessageContents[msg.messageNumber] = msg.content;
      });
      setMessageContents(newMessageContents);
      
      // Calculate variations and set active message count
      calculateTotalVariations(newMessageContents[1] || '');
      setActiveMessageCount(Math.max(...template.messages.map(msg => msg.messageNumber)));
    } else {
      // Create mode
      resetModalForm();
    }
    
    setIsModalOpen(true);
    setActiveModalMessage(1);
    setFormErrors({ templateName: '', message1: '' });
  };

  const resetModalForm = () => {
    setIsEditMode(false);
    setEditTemplateId(null);
    setTemplateName('');
    setTemplateType('Residential');
    setMessageContents({1: '', 2: '', 3: '', 4: '', 5: ''});
    setTotalVariations(0);
    setActiveMessageCount(1);
  };

  // Save template
  const handleSaveTemplate = async () => {
    if (!validateForm()) return;
    
    try {
      setError('');
      
      // Prepare messages array
      const messages = Object.entries(messageContents)
        .filter(([number, content]) => content.trim() && parseInt(number) <= activeMessageCount)
        .map(([number, content]) => ({
          messageNumber: parseInt(number),
          content
        }));
      
      const templateData = {
        name: templateName,
        type: templateType,
        messages,
        templateType: activeTab,
      };
      
      if (isEditMode) {
        await updateTemplate(editTemplateId, templateData);
        toast.success(`"${templateName}" template updated successfully`, {
          toastId: `update-${editTemplateId}`
        });
      } else {
        await createTemplate(templateData);
        toast.success(`"${templateName}" template created successfully`, {
          toastId: `create-${Date.now()}`
        });
      }
      
      fetchTemplates();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.toString());
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} template`, {
        toastId: `error-${isEditMode ? 'update' : 'create'}-${Date.now()}`
      });
    }
  };

  // Delete template
  const handleOpenDeleteModal = (template) => {
    setDeleteModal({
      isOpen: true,
      templateId: template._id,
      templateName: template.name
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTemplate(deleteModal.templateId);
      toast.success(`"${deleteModal.templateName}" template deleted successfully`, {
        toastId: `delete-${deleteModal.templateId}`
      });
      fetchTemplates();
    } catch (err) {
      toast.error('Failed to delete template', {
        toastId: `error-delete-${Date.now()}`
      });
    } finally {
      setDeleteModal({ isOpen: false, templateId: null, templateName: '' });
    }
  };

  // Message handling
  const handleMessageChange = (e) => {
    const content = e.target.value;
    setMessageContents(prev => ({...prev, [activeModalMessage]: content}));
    
    if (activeModalMessage === 1) {
      calculateTotalVariations(content);
      setFormErrors(prev => ({...prev, message1: !content.trim() ? 'Message 1 is required' : ''}));
    }
  };

  const handleAddTextSpinner = () => {
    const currentContent = messageContents[activeModalMessage] || '';
    const updatedContent = currentContent + '{option1/option2/option3}';
    
    setMessageContents(prev => ({...prev, [activeModalMessage]: updatedContent}));
    
    if (activeModalMessage === 1) {
      calculateTotalVariations(updatedContent);
      setFormErrors(prev => ({...prev, message1: ''}));
    }
  };

  const handleAddMergeField = () => {
    const currentContent = messageContents[activeModalMessage] || '';
    const updatedContent = currentContent + '{PropertyAddress}';
    
    setMessageContents(prev => ({...prev, [activeModalMessage]: updatedContent}));
    
    if (activeModalMessage === 1) {
      calculateTotalVariations(updatedContent);
      setFormErrors(prev => ({...prev, message1: ''}));
    }
  };

  const calculateTotalVariations = (content) => {
    const matches = content.match(/\{[^{}]*\/[^{}]*\}/g) || [];
    
    let totalVars = 1;
    matches.forEach(match => {
      const options = match.slice(1, -1).split('/');
      totalVars *= options.length;
    });
    
    setTotalVariations(totalVars);
  };

  // Pagination
  const getCurrentPageData = () => {
    const { currentPage, entriesPerPage } = pagination;
    const start = (currentPage - 1) * entriesPerPage;
    return templates.slice(start, start + entriesPerPage);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({...prev, currentPage: page}));
  };

  const handleEntriesPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setPagination({
      entriesPerPage: value,
      totalPages: Math.ceil(templates.length / value),
      currentPage: 1
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Render table
  const renderTable = () => {
    const currentTemplates = getCurrentPageData();
    
    if (loading) return <div className="loading-indicator">Loading templates...</div>;
    if (error) return <div className="error-message"><AlertCircle size={20} /><span>{error}</span></div>;
    if (currentTemplates.length === 0) return <div className="no-data-message">No templates found.</div>;
    
    if (activeTab === 'initial' || activeTab === 'followup') {
      return (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="template-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Messages</th>
                  <th>Type</th>
                  <th>Delivery %</th>
                  <th>Response %</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTemplates.map((template) => (
                  <tr key={template._id}>
                    <td className="template-name">{template.name}</td>
                    <td className="template-messages">
                      <MessagePreview messages={template.messages} />
                    </td>
                    <td>{template.type}</td>
                    <td>{template.delivery?.toFixed(2) || '0.00'}%</td>
                    <td>{template.response?.toFixed(2) || '0.00'}%</td>
                    <td>{formatDate(template.created)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-button" onClick={() => handleOpenViewModal(template)} title="View template">
                          <span className="view-icon">👁️</span>
                        </button>
                        <button className="icon-button" onClick={() => handleOpenModal(template)} title="Edit template">✏️</button>
                        <button className="icon-button" onClick={() => handleOpenDeleteModal(template)} title="Delete template">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activeTab === 'quick') {
      return (
        <table className="templates-table quick-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTemplates.map((template) => (
              <tr key={template._id}>
                <td>{template.name}</td>
                <td>{template.category || 'My templates'}</td>
                <td><MessagePreview messages={template.messages} /></td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-button" onClick={() => handleOpenViewModal(template)} title="View template">
                      <span className="view-icon">👁️</span>
                    </button>
                    <button className="icon-button" onClick={() => handleOpenModal(template)} title="Edit template">
                      <span className="edit-icon">✏️</span>
                    </button>
                    <button className="icon-button" onClick={() => handleOpenDeleteModal(template)} title="Delete template">
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    
    return null;
  };

  return (
    <div className="templates-container">
      {/* Toast Container - Configure with preventDuplicates */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        limit={1} 
        preventDuplicates
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        templateName={deleteModal.templateName}
        onCancel={() => setDeleteModal({isOpen: false, templateId: null, templateName: ''})}
        onConfirm={handleConfirmDelete}
      />
      
      {/* View template modal */}
      <ViewTemplateModal
        isOpen={viewModal.isOpen}
        template={viewModal.template}
        onClose={() => setViewModal({isOpen: false, template: null})}
      />
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 className="dashboard-title" style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 10px 0' }}>
          Templates
        </h1>
        <div style={{ height: '4px', width: '100px', backgroundColor: '#22c55e', borderRadius: '9999px' }} />
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button onClick={() => setActiveTab('initial')} className={`tab-button ${activeTab === 'initial' ? 'active' : ''}`}>
          Initial Messages
        </button>
        <button onClick={() => setActiveTab('quick')} className={`tab-button ${activeTab === 'quick' ? 'active' : ''}`}>
          Quick Replies
        </button>
        <button onClick={() => setActiveTab('followup')} className={`tab-button ${activeTab === 'followup' ? 'active' : ''}`}>
          Follow Up Messages
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder={`Search ${activeTab} template`}
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="right-filters">
          <span className="category-label">Template category</span>
          <div className="select-container">
            <select className="category-select">
              <option>All</option>
              <option>My templates</option>
            </select>
            <ChevronDown className="select-icon" />
          </div>
          
          <button className="create-user-button create-button" onClick={() => handleOpenModal()}>
            Create New
          </button>
        </div>
      </div>
      
      {/* Table content */}
      <div className="table-container">
        {renderTable()}
        
        {/* Pagination */}
        <div className="pagination-container">
          <div className="total-info">
            Total: <span>{templates.length}</span>
          </div>
          
          <div className="pagination-controls">
            <button className="pagination-button" onClick={() => handlePageChange(1)} disabled={pagination.currentPage === 1}>
              <ChevronsLeft className="pagination-icon" />
            </button>
            <button className="pagination-button" onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))} disabled={pagination.currentPage === 1}>
              <ChevronLeft className="pagination-icon" />
            </button>
            
            {/* Page numbers */}
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => (
              <button 
                key={index}
                className={`pagination-button ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button className="pagination-button" onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))} disabled={pagination.currentPage === pagination.totalPages}>
              <ChevronRight className="pagination-icon" />
            </button>
            <button className="pagination-button" onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages}>
              <ChevronsRight className="pagination-icon" />
            </button>
          </div>
          
          <div className="entries-selector">
            <span>Entries</span>
            <div className="entries-select-container">
              <select className="entries-select" value={pagination.entriesPerPage} onChange={handleEntriesPerPageChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="entries-select-icon" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Create/Edit Template Modal */}
      {isModalOpen && (
        <div className="modal-overlay2">
          <div className="modal-container2">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit' : 'Create'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Template</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content9">
              <div className="modal-form">
                {error && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="form-row1">
                  <div className="form-group1">
                    <label htmlFor="templateName">Template Name <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      id="templateName" 
                      placeholder="Enter Template Name"
                      value={templateName}
                      onChange={(e) => {
                        setTemplateName(e.target.value);
                        setFormErrors(prev => ({...prev, templateName: !e.target.value.trim() ? 'Template name is required' : ''}));
                      }}
                      className={formErrors.templateName ? 'input-error' : ''}
                    />
                    {formErrors.templateName && <div className="error-text">{formErrors.templateName}</div>}
                  </div>
                  <div className="form-group1">
                    <label htmlFor="templateType">Template Type <span style={{ color: 'red' }}>*</span></label>
                    <div className="select-wrapper">
                      <select id="templateType" value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      {/* <ChevronDown className="select-icon" /> */}
                    </div>
                  </div>
                </div>
                
                <div className="messages-section">
                  <div className="messages-header">
                    <h3>Messages <span style={{ color: 'red' }}>*</span></h3>
                    <div className="message-count-info">
                      <span>Active Messages:</span>
                      <div className="select-wrapper active-message-count">
                        <select value={activeMessageCount} onChange={(e) => setActiveMessageCount(parseInt(e.target.value))}>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        <ChevronDown className="select-icon" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="message-tabs">
                    {[1, 2, 3, 4, 5].map(num => (
                      <div 
                        key={num}
                        className={`message-tab ${activeModalMessage === num ? 'active' : ''} ${num <= activeMessageCount ? 'enabled' : 'disabled'}`}
                        onClick={() => num <= activeMessageCount && setActiveModalMessage(num)}
                      >
                        <span className="message-number">{num}</span>
                        {num === 1 && <span className="message-label">Message 1</span>}
                        {num === 2 && num <= activeMessageCount && <span className="message-label">Message 2</span>}
                        {num > 2 && num <= activeMessageCount && <span className="message-label">Msg {num}</span>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="message-editor">
                    <textarea
                      placeholder={`Write your message ${activeModalMessage}`}
                      value={messageContents[activeModalMessage] || ''}
                      onChange={handleMessageChange}
                      disabled={activeModalMessage > activeMessageCount}
                      className={activeModalMessage === 1 && formErrors.message1 ? 'input-error' : ''}
                    />
                    {activeModalMessage === 1 && formErrors.message1 && (
                      <div className="error-text">{formErrors.message1}</div>
                    )}
                    <div className="message-footer">
                      <div className="character-count">
                        {(messageContents[activeModalMessage] || '').length} / 320
                      </div>
                      <div className="message-actions">
                        <button className="emoji-button">
                          <Smile size={18} />
                        </button>
                        <button 
                          className="text-spinner-button" 
                          onClick={handleAddTextSpinner}
                          disabled={activeModalMessage > activeMessageCount}
                        >
                          Add Text Spinner
                        </button>
                        <button 
                          className="merge-field-button" 
                          onClick={handleAddMergeField}
                          disabled={activeModalMessage > activeMessageCount}
                        >
                          Add Merge Field
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <div className="left-actions">
                    <button 
                      className="back-button" 
                      onClick={() => setActiveModalMessage(prev => Math.max(prev - 1, 1))} 
                      disabled={activeModalMessage === 1}
                    >
                      Back
                    </button>
                  </div>
                  
                  <div className="variations-count">
                    Total Variations: {totalVariations}
                  </div>
                  
                  <div className="right-actions">
                    <button 
                      className="next-message-button" 
                      onClick={() => {
                        const nextMessage = Math.min(activeModalMessage + 1, 5);
                        setActiveModalMessage(nextMessage);
                        if (nextMessage > activeMessageCount) {
                          setActiveMessageCount(nextMessage);
                        }
                      }}
                      disabled={activeModalMessage === 5 || activeModalMessage >= activeMessageCount}
                    >
                      Next Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer4">
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button 
                className="save-button" 
                onClick={handleSaveTemplate}
                disabled={!templateName || !messageContents[1]}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesManagement;