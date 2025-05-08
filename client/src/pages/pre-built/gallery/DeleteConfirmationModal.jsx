import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-in-out'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '450px',
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, color 0.2s'
  },
  modalBody: {
    padding: '24px 20px',
    textAlign: 'center'
  },
  warningIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
    color: '#ef4444'
  },
  modalSubtitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  modalText: {
    color: '#4b5563',
    margin: '0 0 8px 0',
    fontSize: '16px'
  },
  modalSubtext: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  confirmButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

// Create style tag for animations
const createStyleTag = () => {
  const style = document.createElement('style');
  style.id = 'delete-modal-animations';
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 640px) {
      .responsive-modal-footer {
        flex-direction: column;
      }
      
      .responsive-modal-button {
        width: 100%;
        padding: 12px;
        margin: 4px 0;
      }
    }
  `;
  
  return style;
};

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName, itemType }) {
  // Add animations style tag on mount
  useEffect(() => {
    if (!document.getElementById('delete-modal-animations')) {
      document.head.appendChild(createStyleTag());
    }
    
    // Clean up on unmount
    return () => {
      const styleTag = document.getElementById('delete-modal-animations');
      if (styleTag) {
        styleTag.parentNode.removeChild(styleTag);
      }
    };
  }, []);

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
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={handleOverlayClick}>
      <div style={styles.modalContainer}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Confirm Delete</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.warningIcon}>
            <AlertCircle size={48} />
          </div>
          <h3 style={styles.modalSubtitle}>Delete {itemType}?</h3>
          <p style={styles.modalText}>
            Are you sure you want to delete <strong>"{itemName}"</strong>?
          </p>
          <p style={styles.modalSubtext}>
            This action cannot be undone.
          </p>
        </div>
        <div 
          style={styles.modalFooter} 
          className="responsive-modal-footer"
        >
          <button 
            style={styles.cancelButton}
            className="responsive-modal-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            style={styles.confirmButton}
            className="responsive-modal-button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;