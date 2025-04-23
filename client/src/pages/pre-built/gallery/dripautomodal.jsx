import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/assets/css/dripautomodal.css";

export default function DripAutomationModal({ isOpen, onClose, onSave }) {
  const [automationName, setAutomationName] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, day: 1, content: "", textSpinners: [], mergeFields: [] }
  ]);
  const [nameError, setNameError] = useState(false);

  const handleAddMessage = () => {
    const newId = messages.length + 1;
    setMessages([...messages, { id: newId, day: 1, content: "", textSpinners: [], mergeFields: [] }]);
  };

  const handleSave = () => {
    if (!automationName.trim()) {
      setNameError(true);
      return;
    }
    onSave({ name: automationName, messages });
    onClose();
  };

  const updateMessage = (id, field, value) => {
    const newMessages = messages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    );
    setMessages(newMessages);
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
          textSpinners: [...msg.textSpinners, { id: Date.now(), options: ["Option 1", "Option 2", "Option 3"] }]
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
          mergeFields: [...msg.mergeFields, { id: Date.now(), field: "{{name}}" }]
        };
      }
      return msg;
    });
    setMessages(newMessages);
  };

  const deleteMessage = (messageId) => {
    const newMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(newMessages);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="xl" centered backdrop="static" className="drip-automation-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Drip Automation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="message-counter">Message count: {messages.length} Message{messages.length !== 1 ? 's' : ''}</div>

        <div className="name-container">
          <div className="name-label-container">
            <Form.Label className="name-label">Name Drip Automation</Form.Label>
            <div className="info-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <Form.Control
            type="text"
            placeholder="Enter Drip Automation"
            value={automationName}
            onChange={(e) => {
              setAutomationName(e.target.value);
              setNameError(false);
            }}
            className={nameError ? 'error-input' : ''}
          />
          {nameError && <p className="error-message">Name is required</p>}
        </div>

        {messages.map((msg, index) => (
          <div key={msg.id} className="message-card">
            <div className="message-header">Message {index + 1}</div>
            
            <div className="day-selector-container">
              <span className="day-label">Send on Day</span>
              <div className="day-counter">
                <button
                  onClick={() => decrementDay(msg.id)}
                  className="counter-button counter-button-left"
                >
                  <span>-</span>
                </button>
                <span className="day-display">{msg.day}</span>
                <button
                  onClick={() => incrementDay(msg.id)}
                  className="counter-button counter-button-right"
                >
                  <span>+</span>
                </button>
              </div>
              <span className="day-info">After prospect has been added to the Drip Automation</span>
            </div>
            
            <Form.Control
              as="textarea"
              placeholder="Write Message"
              value={msg.content}
              onChange={(e) => updateMessage(msg.id, "content", e.target.value)}
              className="message-textarea"
            />
            
            <div className="message-actions">
            
              <Button 
                variant="light"
                size="sm"
                onClick={() => addMergeField(msg.id)}
                className="action-button"
              >
                <span className="button-icon">🔀</span> Add Merge Field
              </Button>
              <div className="spacer"></div>
              <Button 
                variant="link"
                className="icon-button delete-button"
                onClick={() => deleteMessage(msg.id)}
              >
                <span>🗑️</span>
              </Button>
              <Button 
                variant="link"
                className="icon-button check-button"
              >
                <span>✓</span>
              </Button>
            </div>
          </div>
        ))}

        <div className="add-message-container">
          <Button
            variant="link"
            className="add-message-button"
            onClick={handleAddMessage}
          >
            <span className="plus-icon">+</span> Add message {messages.length + 1}
          </Button>
        </div>

        <div className="save-container">
          <Button
            variant="dark"
            onClick={handleSave}
            className="save-button"
          >
            Save Drip Automation
          </Button>
        </div>

        {/* Validation sidebar */}
        {/* <div className="validation-sidebar">
          <h5 className="validation-title">Messages</h5>
          <ul className="validation-list">
            <li className="validation-item">
              <span className="validation-pending">○</span>
              <span>Minimum of 8 characters</span>
            </li>
            <li className="validation-item">
              <span className="validation-pending">○</span>
              <span>At least 2 Text Spinners [0/2]</span>
            </li>
            <li className="validation-item">
              <span className="validation-pending">○</span>
              <span>Each Text Spinner must have at least 3 elements</span>
            </li>
            <li className="validation-item">
              <span className="validation-pending">○</span>
              <span>Must have Merge Field</span>
            </li>
            <li className="validation-item">
              <span className="validation-success">✓</span>
              <span>Must have no negative/restricted keywords</span>
            </li>
            <li className="validation-item">
              <span className="validation-success">✓</span>
              <span>All Merge Fields and Text Spinners must be valid</span>
            </li>
          </ul>
        </div> */}
      </Modal.Body>
    </Modal>
  );
}