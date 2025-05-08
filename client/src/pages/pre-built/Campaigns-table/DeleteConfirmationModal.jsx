import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, campaignName, onCancel, onConfirm }) => {
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
          <h3>Delete Campaign</h3>
          <button className="close-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="delete-modal-body">
          <div className="warning-icon">
            <AlertCircle size={48} />
          </div>
          <h4>Delete Campaign?</h4>
          <p className="modal-text">
            Are you sure you want to delete <strong>"{campaignName}"</strong>?
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

export default DeleteConfirmationModal;