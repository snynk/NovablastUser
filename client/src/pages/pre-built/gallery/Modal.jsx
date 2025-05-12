import React from 'react';
import "@/assets/css/settings.css"; // Make sure this path is correct relative to Modal.js

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

export default Modal;