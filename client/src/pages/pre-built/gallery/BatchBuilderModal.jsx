import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { batchesService } from '@/services/batchesService';
import '@/assets/css/batch-builder-modal.css';
import BatchCreateSendModal from './BatchCreateSendModal'; // Import the second modal

const BatchBuilderModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(1);
  
  // Campaign data
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactCount, setContactCount] = useState(0);
  
  // Template data
  const [templates, setTemplates] = useState([]);
  const [templateTypes, setTemplateTypes] = useState(['Residential', 'Commercial']);
  const [selectedTemplateType, setSelectedTemplateType] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateMessages, setTemplateMessages] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  // Batch settings
  const [batchSettings, setBatchSettings] = useState({
    batchSize: 100,
    sendRate: 'normal',
    scheduleDate: '',
    scheduleTime: ''
  });
  
  // State for second modal
  const [isCreateSendModalOpen, setIsCreateSendModalOpen] = useState(false);
  const [createdBatchData, setCreatedBatchData] = useState(null);
  
  // Fetch campaigns when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
      fetchTemplates();
    }
    // Reset state when modal closes
    return () => {
      if (!isOpen) {
        setSelectedStep(1);
        setSelectedCampaign(null);
        setSelectedTemplate(null);
        setSelectedTemplateType('');
        setTemplateMessages([]);
        setSearchTerm('');
        setContactCount(0);
        setBatchSettings({
          batchSize: 100,
          sendRate: 'normal',
          scheduleDate: '',
          scheduleTime: ''
        });
      }
    };
  }, [isOpen]);

  // Filter templates when template type changes
  useEffect(() => {
    if (selectedTemplateType) {
      const filtered = templates.filter(template => template.type === selectedTemplateType);
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates([]);
    }
    // Reset selected template when type changes
    setSelectedTemplate(null);
    setTemplateMessages([]);
  }, [selectedTemplateType, templates]);

  // Fetch contact count when campaign is selected
  useEffect(() => {
    if (selectedCampaign && selectedCampaign.contactListId) {
      fetchContactCount(selectedCampaign.contactListId);
    }
  }, [selectedCampaign]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await batchesService.getAllCampaigns();
      setCampaigns(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      setError(null);
      const data = await batchesService.getAllTemplates();
      setTemplates(data);
      setLoadingTemplates(false);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError('Failed to load templates. Please try again.');
      setLoadingTemplates(false);
    }
  };

  const fetchContactCount = async (contactListId) => {
    try {
      setLoading(true);
      const count = await batchesService.getContactCountByListId(contactListId);
      setContactCount(count);
      // Set the batch size to match the contact count
      setBatchSettings(prev => ({
        ...prev,
        batchSize: count
      }));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load contact count:', err);
      setError('Failed to load contact count. Please try again.');
      setLoading(false);
    }
  };

  const fetchTemplateMessages = async (templateId) => {
    try {
      setLoadingTemplates(true);
      // Try to find template in local state first
      const template = templates.find(t => t._id === templateId);
      if (template && template.messages) {
        setTemplateMessages(template.messages);
      } else {
        // If you need to fetch messages separately
        const data = await batchesService.getTemplateMessages(templateId);
        setTemplateMessages(data);
      }
      setLoadingTemplates(false);
    } catch (err) {
      console.error('Failed to load template messages:', err);
      setError('Failed to load template messages. Please try again.');
      setLoadingTemplates(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedStep(2);
  };

  const handleTemplateTypeChange = (e) => {
    setSelectedTemplateType(e.target.value);
  };

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    if (templateId) {
      const template = templates.find(t => t._id === templateId);
      setSelectedTemplate(template);
      fetchTemplateMessages(templateId);
    } else {
      setSelectedTemplate(null);
      setTemplateMessages([]);
    }
  };

  const handleBatchSettingChange = (e) => {
    const { name, value } = e.target;
    // Don't allow changing batch size since it's autofilled based on contact count
    if (name !== 'batchSize') {
      setBatchSettings({
        ...prev,
        [name]: value
      });
    }
  };

  const handleNextStep = () => {
    if (selectedStep < 3 && selectedStep === 2 && selectedTemplate) {
      setSelectedStep(3);
    }
  };

  const handlePrevStep = () => {
    if (selectedStep > 1) {
      setSelectedStep(selectedStep - 1);
    }
  };

  // Generate a batch number
  const generateBatchNumber = () => {
    const date = new Date();
    const prefix = `B${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${randomNum}`;
  };

  // Handle closing the create send modal
  const handleCloseCreateSendModal = () => {
    setIsCreateSendModalOpen(false);
    // Close the BatchBuilderModal too if needed
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleCreateBatch = async () => {
    try {
      setError(null);
      
      // Validate required fields
      if (!selectedCampaign || !selectedCampaign._id) {
        setError('Campaign not selected. Please go back and select a campaign.');
        return;
      }
      
      if (!selectedTemplate) {
        setError('Template not selected. Please go back and select a template.');
        return;
      }
      
      // Combine date and time for scheduled date if both exist
      let scheduledDate = null;
      if (batchSettings.scheduleDate && batchSettings.scheduleTime) {
        scheduledDate = new Date(`${batchSettings.scheduleDate}T${batchSettings.scheduleTime}`);
        // Check if the date is valid
        if (isNaN(scheduledDate.getTime())) {
          setError('Invalid schedule date/time. Please check the format.');
          return;
        }
      }
      
      // Create batch data object with all required fields
      const batchData = {
        batchNumber: generateBatchNumber(), // Generate a batch number
        campaignId: selectedCampaign._id,
        // Get userId from localStorage or context - assuming we store it after login
        userId: localStorage.getItem('userId') || '60d0fe4f5311236168a109ca', // Fallback to a default ID
        totalMessages: parseInt(batchSettings.batchSize) || 0,
        sendRate: batchSettings.sendRate,
        scheduledDate: scheduledDate,
        templateUsed: selectedTemplate ? selectedTemplate.name : 'Default',
        status: 'pending' // Use a valid enum value
      };
      
      console.log('Creating batch with data:', batchData);
      
      const result = await batchesService.createBatch(batchData);
      console.log('Batch created successfully:', result);
      
      // Store the created batch data
      setCreatedBatchData(result);
      
      // Open the BatchCreateSendModal
      setIsCreateSendModalOpen(true);
    } catch (err) {
      console.error('Failed to create batch:', err);
      setError(`Failed to create batch: ${err.message || 'Please try again'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay4">
        <div className="batch-builder-modal4">
          {/* Modal Header */}
          <div className="modal-header4">
            <h2>Batch Create New</h2>
            <button className="close-button4" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Modal Content */}
          <div className="modal-content4">
            {/* Steps Indicator */}
            <div className="steps-indicator4">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className={`step ${selectedStep >= step ? 'active' : ''}`}>
                  <div className="step-number4">{step}</div>
                  {index < 2 && <div className="step-line4"></div>}
                </div>
              ))}
            </div>

            <div className="steps-container4">
              {/* Step 1: Select Campaign */}
              <div className={`step-content4 ${selectedStep === 1 ? 'active-step' : 'hidden-step'}`}>
                <h3>Select Campaign</h3>
                
                {/* Search Box */}
                <div className="search-container4">
                  <div className="search-box">
                    <Search size={16} className="search-icon4" />
                    <input 
                      type="text" 
                      placeholder="Search Campaigns" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Campaign List */}
                <div className="campaign-list4">
                  {/* Header */}
                  <div className="campaign-header4">
                    <div className="created-at4">Created at</div>
                    <div className="campaign-name4">Campaign</div>
                    <div className="actions4">Actions</div>
                  </div>

                  {/* Campaign Items */}
                  <div className="campaign-items4">
                    {loading ? (
                      <div className="loading-indicator">Loading campaigns...</div>
                    ) : filteredCampaigns.length === 0 ? (
                      <div className="no-results">No campaigns found</div>
                    ) : (
                      filteredCampaigns.map(campaign => (
                        <div key={campaign._id} className="campaign-item4">
                          <div className="created-at4">
                            {new Date(campaign.created).toLocaleDateString()}
                          </div>
                          <div className="campaign-info4">
                            <div className="campaign-name4">{campaign.name}</div>
                            <div className="prospects-available4">
                              Market: {campaign.market} 
                              {/* | Response: {campaign.response || '0%'} */}
                            </div>
                          </div>
                          <div className="actions4">
                            <button 
                              onClick={() => handleCampaignSelect(campaign)}
                              className="select-button4"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Message Template */}
              <div className={`step-content4 ${selectedStep === 2 ? 'active-step' : 'hidden-step'}`}>
                <h3>Message Template</h3>
                
                {/* Template Selection Area */}
                <div className="template-selection-area">
                  {/* Template Type Dropdown */}
                  <div className="template-form-group">
                    <div className="dropdown-container">
                      <select 
                        value={selectedTemplateType}
                        onChange={handleTemplateTypeChange}
                        className="template-dropdown"
                      >
                        <option value="">Select Template Type</option>
                        {templateTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Template Name Dropdown */}
                  <div className="template-form-group">
                    <div className="dropdown-container">
                      <select 
                        value={selectedTemplate ? selectedTemplate._id : ''}
                        onChange={handleTemplateSelect}
                        className="template-dropdown"
                        disabled={!selectedTemplateType}
                      >
                        <option value="">Select Template</option>
                        {filteredTemplates.map((template) => (
                          <option key={template._id} value={template._id}>{template.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Template Messages Preview */}
                <div className="template-messages-preview">
                  {loadingTemplates ? (
                    <div className="loading-indicator">Loading template messages...</div>
                  ) : templateMessages.length === 0 ? (
                    <div className="no-messages-placeholder">
                      Please first select the message template and see messages
                    </div>
                  ) : (
                    <div className="messages-container">
                      {templateMessages.map((message, index) => (
                        <div key={index} className="template-message-item">
                          <div className="message-number1">Message {message.messageNumber}</div>
                          <div className="message-content">{message.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Template Stats */}
                {selectedTemplate && (
                  <div className="template-stats">
                    <div className="variations-counter">
                      Variations: {templateMessages.length || 0}
                    </div>
                    {selectedTemplate.delivery > 0 && (
                      <div className="delivery-stats">
                        Delivery: {selectedTemplate.delivery}%
                      </div>
                    )}
                    {selectedTemplate.response > 0 && (
                      <div className="response-stats">
                        Response: {selectedTemplate.response}%
                      </div>
                    )}
                  </div>
                )}
                
                <div className="modal-footer4">
                  <button className="back-button4" onClick={handlePrevStep}>Back</button>
                  <button 
                    className="next-button4" 
                    onClick={handleNextStep}
                    disabled={!selectedTemplate}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Step 3: Batch Size and Settings */}
              <div className={`step-content4 ${selectedStep === 3 ? 'active-step' : 'hidden-step'}`}>
                <h3>Batch Size and Settings</h3>
                
                {/* Batch Settings Form */}
                <div className="batch-settings-form">
                  {/* Batch Size Input - Now read-only */}
                  <div className="form-group">
                    <label htmlFor="batchSize">Batch Size (Auto-filled from Contact List)</label>
                    <input
                      type="number"
                      id="batchSize"
                      name="batchSize"
                      value={batchSettings.batchSize}
                      readOnly
                      className="read-only-input"
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                    <small className="info-text">
                      This value is automatically set based on the selected campaign's contact list ({contactCount} contacts).
                    </small>
                  </div>
                  
                  {/* Send Rate Select */}
                  <div className="form-group">
                    <label htmlFor="sendRate">Send Rate</label>
                    <select
                      id="sendRate"
                      name="sendRate"
                      value={batchSettings.sendRate}
                      onChange={handleBatchSettingChange}
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                  
                  {/* Schedule Date & Time */}
                  <div className="form-group">
                    <label>Schedule (Optional)</label>
                    <div className="schedule-inputs">
                      <div className="date-input">
                        <input
                          type="date"
                          name="scheduleDate"
                          value={batchSettings.scheduleDate}
                          onChange={handleBatchSettingChange}
                          min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        />
                      </div>
                      <div className="time-input">
                        <input
                          type="time"
                          name="scheduleTime"
                          value={batchSettings.scheduleTime}
                          onChange={handleBatchSettingChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer4">
                  <button className="back-button4" onClick={handlePrevStep}>Back</button>
                  <button 
                    className="create-batch-button4"
                    onClick={handleCreateBatch}
                  >
                    Create Batch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BatchCreateSendModal - This will be displayed when isCreateSendModalOpen is true */}
      <BatchCreateSendModal 
        isOpen={isCreateSendModalOpen}
        onClose={handleCloseCreateSendModal}
        campaignData={selectedCampaign}
        templateData={selectedTemplate}
        batchData={createdBatchData}
      />
    </>
  );
};

export default BatchBuilderModal;