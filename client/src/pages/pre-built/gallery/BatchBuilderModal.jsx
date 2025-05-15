import React, { useState, useEffect } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { batchesService } from '@/services/batchesService';
import '@/assets/css/batch-builder-modal.css';
import BatchCreateSendModal from './BatchCreateSendModal';



const BatchBuilderModal = ({ isOpen, onClose, onSuccess }) => {
  // Core state management  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(1);
  const [isCreateSendModalOpen, setIsCreateSendModalOpen] = useState(false);

  // Data state
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactCount, setContactCount] = useState(0);
  const [templateTypes] = useState(['Residential', 'Commercial']);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [templateMessages, setTemplateMessages] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [createdBatchData, setCreatedBatchData] = useState(null);

  // Selected data
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedTemplateType, setSelectedTemplateType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Batch settings with proper date and time format
  const [batchSettings, setBatchSettings] = useState({
    batchSize: 100,
    sendRate: 'normal',
    scheduleDate: '',
    scheduleTime: ''
  });

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
      fetchTemplates();
    }
    // Reset state when modal closes
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Filter templates when template type changes
  useEffect(() => {
    if (selectedTemplateType) {
      setFilteredTemplates(templates.filter(template => template.type === selectedTemplateType));
    } else {
      setFilteredTemplates([]);
    }
    setSelectedTemplate(null);
    setTemplateMessages([]);
  }, [selectedTemplateType, templates]);

  // Get contact count when campaign is selected
  useEffect(() => {
    if (selectedCampaign?.contactListId) {
      fetchContactCount(selectedCampaign.contactListId);
    }
  }, [selectedCampaign]);

  // Reset all form data
  const resetForm = () => {
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
  };

  // Data fetching functions
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await batchesService.getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns. Please try again.');
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await batchesService.getAllTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error('Failed to load templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchContactCount = async (contactListId) => {
    try {
      setLoading(true);
      const count = await batchesService.getContactCountByListId(contactListId);
      setContactCount(count);
      setBatchSettings(prev => ({ ...prev, batchSize: count }));
    } catch (err) {
      setError('Failed to load contact count. Please try again.');
      console.error('Failed to load contact count:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateMessages = async (templateId) => {
    try {
      setLoadingTemplates(true);
      // Try to find template in local state first
      const template = templates.find(t => t._id === templateId);
      if (template?.messages) {
        setTemplateMessages(template.messages);
      } else {
        const data = await batchesService.getTemplateMessages(templateId);
        setTemplateMessages(data);
      }
    } catch (err) {
      setError('Failed to load template messages. Please try again.');
      console.error('Failed to load template messages:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Event handlers
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
    // Don't allow batch size changes
    if (name !== 'batchSize') {
      setBatchSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // Navigation
  const handleNextStep = () => {
    if (selectedStep === 2 && selectedTemplate) {
      setSelectedStep(3);
    }
  };

  const handlePrevStep = () => {
    if (selectedStep > 1) {
      setSelectedStep(selectedStep - 1);
    }
  };

  // Generate batch number with format B + YYYYMM + random 4 digits
  const generateBatchNumber = () => {
    const date = new Date();
    const prefix = `B${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${randomNum}`;
  };

  // Handle create batch action
  const handleCreateBatch = async () => {
    try {
      setError(null);
      
      // Validate required fields
      if (!selectedCampaign?._id) {
        setError('Campaign not selected. Please go back and select a campaign.');
        return;
      }
      
      if (!selectedTemplate) {
        setError('Template not selected. Please go back and select a template.');
        return;
      }
      
      // Process date and time for scheduled date
      let scheduledDate = null;
      if (batchSettings.scheduleDate && batchSettings.scheduleTime) {
        scheduledDate = new Date(`${batchSettings.scheduleDate}T${batchSettings.scheduleTime}`);
        if (isNaN(scheduledDate.getTime())) {
          setError('Invalid schedule date/time. Please check the format.');
          return;
        }
      }
      
      // Create batch data object
      const batchData = {
        batchNumber: generateBatchNumber(),
        campaignId: selectedCampaign._id,
        userId: localStorage.getItem('userId') || '60d0fe4f5311236168a109ca',
        totalMessages: parseInt(batchSettings.batchSize) || 0,
        sendRate: batchSettings.sendRate,
        scheduledDate: scheduledDate,
        templateUsed: selectedTemplate?.name || 'Default',
        status: 'pending'
      };
      
      const result = await batchesService.createBatch(batchData);
      setCreatedBatchData(result);
      setIsCreateSendModalOpen(true);
    } catch (err) {
      console.error('Failed to create batch:', err);
      setError(`Failed to create batch: ${err.message || 'Please try again'}`);
    }
  };

  // Handle second modal close
  const handleCloseCreateSendModal = () => {
    setIsCreateSendModalOpen(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  // Filter campaigns by search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Steps Indicator */}
          <div className="steps-indicator4">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className={`step ${selectedStep >= step ? 'active' : ''}`}>
                <div className="step-number4">{step}</div>
                {index < 2 && <div className="step-line4"></div>}
              </div>
            ))}
          </div>

          <div className="modal-content4">
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
                  <div className="campaign-header4">
                    <div className="created-at4">Created at</div>
                    <div className="campaign-name4">Campaign</div>
                    <div className="actions4">Actions</div>
                  </div>

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
                
                {/* Template Selection */}
                <div className="template-selection-area">
                  <div className="template-form-group">
                    <select 
                      value={selectedTemplateType}
                      onChange={handleTemplateTypeChange}
                      className="template-dropdown"
                    >
                      <option value="">Select Template Type</option>
                      {templateTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="template-form-group">
                    <select 
                      value={selectedTemplate?._id || ''}
                      onChange={handleTemplateSelect}
                      className="template-dropdown"
                      disabled={!selectedTemplateType}
                    >
                      <option value="">Select Template</option>
                      {filteredTemplates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                      ))}
                    </select>
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
                
                <div className="batch-settings-form">
                  {/* Batch Size - Read only */}
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
                  
                  {/* Send Rate */}
                  <div className="form-group">
                    <label htmlFor="sendRate">Send Rate</label>
                    <select
                      id="sendRate"
                      name="sendRate"
                      value={batchSettings.sendRate}
                      onChange={handleBatchSettingChange}
                    >
                      {['slow', 'normal', 'fast'].map(rate => (
                        <option key={rate} value={rate}>{rate.charAt(0).toUpperCase() + rate.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Schedule Date & Time - Fixed implementation */}
                  <div className="form-group">
                    <label>Schedule (Optional)</label>
                    <div className="schedule-inputs">
                      <div className="date-input">
                        <input
                          type="date"
                          name="scheduleDate"
                          value={batchSettings.scheduleDate}
                          onChange={handleBatchSettingChange}
                          min={new Date().toISOString().split('T')[0]}
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

      {/* BatchCreateSendModal */}
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