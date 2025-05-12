import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { X, Plus, Trash2, Info } from 'lucide-react';
import "@/assets/css/dripautomodal.css";

export default function DripAutomationModal({ isOpen, onClose, onSave, automationData }) {
  const [automationName, setAutomationName] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, day: 1, content: "", textSpinners: [], mergeFields: [] }
  ]);
  const [nameError, setNameError] = useState(false);
  const [messageErrors, setMessageErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [messageLimit, setMessageLimit] = useState(1);
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (automationData) {
      setIsEditing(true);
      setAutomationName(automationData.name || "");
      
      if (automationData.messages && automationData.messages.length > 0) {
        // Map backend messages to our component's format
        const formattedMessages = automationData.messages.map((msg, index) => ({
          id: index + 1,
          day: msg.day || 1,
          content: msg.content || "",
          textSpinners: Array.isArray(msg.textSpinners) ? msg.textSpinners : [],
          mergeFields: Array.isArray(msg.mergeFields) ? msg.mergeFields : []
        }));
        setMessages(formattedMessages);
        setMessageLimit(formattedMessages.length);
      } else {
        // Reset to default if no messages
        setMessages([
          { id: 1, day: 1, content: "", textSpinners: [], mergeFields: [] }
        ]);
        setMessageLimit(1);
      }
    } else {
      // Reset form for new automation
      setIsEditing(false);
      setAutomationName("");
      setMessages([
        { id: 1, day: 1, content: "", textSpinners: [], mergeFields: [] }
      ]);
      setMessageLimit(1);
    }
    
    // Clear validation errors
    setNameError(false);
    setMessageErrors({});
  }, [automationData, isOpen]);

  // Handle modal click outside
  const handleModalClick = (e) => {
    if (e.target.classList.contains('drip-modal-overlay')) {
      onClose();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLimitDropdown && !event.target.closest('.drip-limit-dropdown')) {
        setShowLimitDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLimitDropdown]);

  // Handle message limit change
  const handleMessageLimitChange = (limit) => {
    const newLimit = parseInt(limit, 10);
    setMessageLimit(newLimit);
    setShowLimitDropdown(false);
    
    // If increasing limit, add new messages
    if (newLimit > messages.length) {
      let highestDay = messages.length > 0
        ? Math.max(...messages.map(msg => msg.day))
        : 0;
      
      const newMessages = [...messages];
      
      for (let i = messages.length; i < newLimit; i++) {
        highestDay += 1;
        newMessages.push({
          id: Date.now() + i, // Ensure unique ID
          day: highestDay,
          content: "",
          textSpinners: [],
          mergeFields: []
        });
      }
      
      setMessages(newMessages);
    } 
    // If decreasing limit, remove excess messages
    else if (newLimit < messages.length) {
      const trimmedMessages = messages.slice(0, newLimit);
      setMessages(trimmedMessages);
      
      // Clear errors for removed messages
      const newErrors = { ...messageErrors };
      messages.slice(newLimit).forEach(msg => {
        delete newErrors[msg.id];
      });
      setMessageErrors(newErrors);
    }
  };

  const handleAddMessage = () => {
    // Only add a new message if messageLimit is greater than current messages length
    if (messageLimit <= messages.length) {
      toast.warning(`Message limit is set to ${messageLimit}. Increase the limit to add more messages.`);
      return;
    }
    
    const newId = Date.now();
    
    // Find the highest day number to suggest the next day
    const highestDay = messages.length > 0
      ? Math.max(...messages.map(msg => msg.day))
      : 0;
    
    setMessages([
      ...messages, 
      { 
        id: newId, 
        day: highestDay + 1, 
        content: "", 
        textSpinners: [], 
        mergeFields: [] 
      }
    ]);
  };

  const validateMessages = () => {
    const errors = {};
    let isValid = true;
    
    messages.forEach(msg => {
      if (!msg.content.trim()) {
        errors[msg.id] = "Message content is required";
        isValid = false;
      }
    });
    
    setMessageErrors(errors);
    return isValid;
  };

  const handleSave = () => {
    // Validate name
    if (!automationName.trim()) {
      setNameError(true);
      toast.error("Automation name is required");
      return;
    }

    // Validate messages
    if (!validateMessages()) {
      toast.error("Please fill in all message contents");
      return;
    }

    // Prepare data for the API
    const formattedData = {
      name: automationName.trim(),
      messages: messages.map(msg => ({
        day: parseInt(msg.day, 10) || 1,
        content: msg.content.trim(),
        textSpinners: msg.textSpinners || [],
        mergeFields: msg.mergeFields || []
      }))
    };

    onSave(formattedData);
    
    // Show success toast
    if (isEditing) {
      toast.success("Drip automation updated successfully");
    } else {
      toast.success("Drip automation created successfully");
    }
  };

  const updateMessage = (id, field, value) => {
    const newMessages = messages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    );
    setMessages(newMessages);
    
    // Clear error for this message if it exists
    if (messageErrors[id] && field === 'content' && value.trim()) {
      const newErrors = { ...messageErrors };
      delete newErrors[id];
      setMessageErrors(newErrors);
    }
  };

  const decrementDay = (id) => {
    const newMessages = messages.map(msg => 
      msg.id === id ? { ...msg, day: Math.max(1, msg.day - 1) } : msg
    );
    setMessages(newMessages);
  };

  const incrementDay = (id) => {
    const newMessages = messages.map(msg => 
      msg.id === id ? { ...msg, day: msg.day + 1 } : msg
    );
    setMessages(newMessages);
  };

  const addTextSpinner = (messageId) => {
    const newMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          textSpinners: [
            ...msg.textSpinners,
            { id: Date.now(), options: ["Option 1", "Option 2", "Option 3"] }
          ]
        };
      }
      return msg;
    });
    setMessages(newMessages);
  };

  const addMergeField = (messageId) => {
    const newMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          mergeFields: [
            ...msg.mergeFields, 
            { id: Date.now(), field: "{{name}}" }
          ]
        };
      }
      return msg;
    });
    setMessages(newMessages);
  };

  const deleteMessage = (messageId) => {
    // Prevent deleting the last message
    if (messages.length <= 1) {
      toast.warning("You must have at least one message");
      return;
    }
    
    const newMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(newMessages);
    
    // Clear error for this message if it exists
    if (messageErrors[messageId]) {
      const newErrors = { ...messageErrors };
      delete newErrors[messageId];
      setMessageErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drip-modal-overlay" onClick={handleModalClick}>
      <div className="drip-modal" onClick={e => e.stopPropagation()}>
        <div className="drip-modal-header">
          <h2 className="drip-modal-title">
            {isEditing ? 'Edit Drip Automation' : 'Create Drip Automation'}
          </h2>
          <button className="drip-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="drip-modal-body">
          <div className="drip-info-bar">
            <div className="drip-message-counter">
              <span className="drip-counter-value">{messages.length}</span> 
              <span className="drip-counter-label">Message{messages.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="drip-message-limit-selector">
              <label htmlFor="messageLimit" className="drip-limit-label">Message Limit:</label>
              <div className="drip-limit-dropdown">
                <button
                  className="drip-limit-toggle"
                  onClick={() => setShowLimitDropdown(!showLimitDropdown)}
                >
                  {messageLimit}
                </button>

                {showLimitDropdown && (
                  <div className="drip-limit-menu">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <div 
                        key={num} 
                        className={`drip-limit-item ${messageLimit === num ? 'active' : ''}`}
                        onClick={() => handleMessageLimitChange(num)}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="drip-name-container">
            <div className="drip-name-label-container">
              <label className="drip-name-label">Name Drip Automation <span className="required-mark">*</span></label>
              <div className="drip-info-icon" title="Give your automation a descriptive name">
                <Info size={16} />
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter Drip Automation Name"
              value={automationName}
              onChange={(e) => {
                setAutomationName(e.target.value);
                if (e.target.value.trim()) {
                  setNameError(false);
                }
              }}
              className={`drip-name-input ${nameError ? 'drip-error-input' : ''}`}
            />
            {nameError && <p className="drip-error-message">Name is required</p>}
          </div>

          <div className="drip-messages-container">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`drip-message-card ${messageErrors[msg.id] ? 'drip-message-with-error' : ''}`}>
                <div className="drip-message-header">
                  <span className="drip-message-number">Message {index + 1}</span>
                  <button 
                    className="drip-icon-button drip-delete-button"
                    onClick={() => deleteMessage(msg.id)}
                    disabled={messages.length <= 1}
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="drip-day-selector-container">
                  <span className="drip-day-label">Send on Day</span>
                  <div className="drip-day-counter">
                    <button
                      type="button"
                      onClick={() => decrementDay(msg.id)}
                      className="drip-counter-button drip-counter-button-left"
                      disabled={msg.day <= 1}
                    >
                      <span>-</span>
                    </button>
                    <span className="drip-day-display">{msg.day}</span>
                    <button
                      type="button"
                      onClick={() => incrementDay(msg.id)}
                      className="drip-counter-button drip-counter-button-right"
                    >
                      <span>+</span>
                    </button>
                  </div>
                  <span className="drip-day-info">After prospect has been added to the Drip Automation</span>
                </div>
                
                <div className="drip-message-content-container">
                  <textarea
                    placeholder="Write your message here..."
                    value={msg.content}
                    onChange={(e) => updateMessage(msg.id, "content", e.target.value)}
                    className={`drip-message-textarea ${messageErrors[msg.id] ? 'drip-error-input' : ''}`}
                    rows={4}
                  />
                  {messageErrors[msg.id] && (
                    <p className="drip-error-message">{messageErrors[msg.id]}</p>
                  )}
                </div>
                
                <div className="drip-message-actions">
                  <button 
                    onClick={() => addMergeField(msg.id)}
                    className="drip-action-button"
                  >
                    <span className="drip-button-icon">🔀</span> Add Merge Field
                  </button>
                </div>
                
                {/* Display Merge Fields */}
                {msg.mergeFields && msg.mergeFields.length > 0 && (
                  <div className="drip-merge-fields-container">
                    <h6 className="drip-section-title">Merge Fields:</h6>
                    <div className="drip-badges-container">
                      {msg.mergeFields.map((field, idx) => (
                        <span key={idx} className="drip-custom-badge drip-field-badge">
                          {field.field || '{{field}}'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Only show "Add message" button if messageLimit > messages.length */}
          {messageLimit > messages.length && (
            <div className="drip-add-message-container">
              <button
                className="drip-add-message-button"
                onClick={handleAddMessage}
              >
                <span className="drip-plus-icon"><Plus size={18} /></span> 
                <span className="drip-button-text">Add message {messages.length + 1}</span>
              </button>
            </div>
          )}
          
          {/* Message about increasing limit when add button is not shown */}
          {messageLimit <= messages.length && messages.length < 10 && (
            <div className="drip-limit-message">
              <p>Increase message limit to add more messages</p>
            </div>
          )}

          <div className="modal-footer4">
            <button
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-button"
            >
              {isEditing ? 'Update' : 'Save'} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}