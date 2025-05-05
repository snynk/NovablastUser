import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { X, Plus, Trash2, Info } from 'lucide-react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
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

  // Handle message limit change
  const handleMessageLimitChange = (limit) => {
    const newLimit = parseInt(limit, 10);
    setMessageLimit(newLimit);
    
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
    
    // Update message limit to match current message count
    setMessageLimit(messages.length + 1);
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
    
    // Update message limit to match current message count
    setMessageLimit(newMessages.length);
    
    // Clear error for this message if it exists
    if (messageErrors[messageId]) {
      const newErrors = { ...messageErrors };
      delete newErrors[messageId];
      setMessageErrors(newErrors);
    }
  };

  return (
    <Modal 
      show={isOpen} 
      onHide={onClose} 
      size="xl" 
      centered 
      backdrop="static" 
      className="drip-automation-modal"
    >
      <Modal.Header closeButton className="drip-modal-header">
        <Modal.Title className="drip-modal-title">
          {isEditing ? 'Edit Drip Automation' : 'Create Drip Automation'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="drip-modal-body">
        <div className="drip-info-bar">
          <div className="drip-message-counter">
            <span className="drip-counter-value">{messages.length}</span> 
            <span className="drip-counter-label">Message{messages.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="drip-message-limit-selector">
            <label htmlFor="messageLimit" className="drip-limit-label">Message Limit:</label>
            <Dropdown className="drip-limit-dropdown">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="drip-limit-toggle">
                {messageLimit}
              </Dropdown.Toggle>

              <Dropdown.Menu className="drip-limit-menu">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Dropdown.Item 
                    key={num} 
                    onClick={() => handleMessageLimitChange(num)}
                    active={messageLimit === num}
                  >
                    {num}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="drip-name-container">
          <div className="drip-name-label-container">
            <Form.Label className="drip-name-label">Name Drip Automation <span style={{ color: 'red' }}>*</span></Form.Label>
            <div className="drip-info-icon" title="Give your automation a descriptive name">
              <Info size={16} />
            </div>
          </div>
          <Form.Control
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
            <div key={msg.id} className="drip-message-card">
              <div className="drip-message-header">
                <span className="drip-message-number">Message {index + 1}</span>
                <Button 
                  variant="link"
                  className="drip-icon-button drip-delete-button"
                  onClick={() => deleteMessage(msg.id)}
                  disabled={messages.length <= 1}
                  title="Delete message"
                >
                  <Trash2 size={18} />
                </Button>
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
                <Form.Control
                  as="textarea"
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
                {/* <Button 
                  variant="light"
                  size="sm"
                  onClick={() => addTextSpinner(msg.id)}
                  className="drip-action-button"
                >
                  <span className="drip-button-icon">🔄</span> Add Text Spinner
                </Button> */}
                <Button 
                  variant="light"
                  size="sm"
                  onClick={() => addMergeField(msg.id)}
                  className="drip-action-button"
                >
                  <span className="drip-button-icon">🔀</span> Add Merge Field
                </Button>
              </div>
              
              {/* Display Text Spinners */}
              {msg.textSpinners && msg.textSpinners.length > 0 && (
                <div className="drip-spinners-container">
                  <h6 className="drip-section-title">Text Spinners:</h6>
                  <div className="drip-badges-container">
                    {msg.textSpinners.map((spinner, idx) => (
                      <span key={idx} className="drip-custom-badge drip-spinner-badge">
                        {spinner.options ? spinner.options.join(' / ') : 'Text Spinner'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
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

        {messages.length < 10 && (
          <div className="drip-add-message-container">
            <Button
              variant="link"
              className="drip-add-message-button"
              onClick={handleAddMessage}
            >
              <span className="drip-plus-icon"><Plus size={18} /></span> 
              <span className="drip-button-text">Add message {messages.length + 1}</span>
            </Button>
          </div>
        )}

        <div className="drip-save-container">
          <Button
            variant="light"
            onClick={onClose}
            className="drip-cancel-button"
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleSave}
            className="save-button"
          >
            {isEditing ? 'Update' : 'Save'} 
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}