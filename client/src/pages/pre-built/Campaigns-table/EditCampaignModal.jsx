import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown } from 'lucide-react';

const EditCampaignModal = ({ isOpen, campaign, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    market: '',
    callForwardingNumber: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        market: campaign.market || '',
        callForwardingNumber: campaign.callForwardingNumber || ''
      });
    }
  }, [campaign]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !campaign) return null;

  return (
    <>
      <style>
        {`
      

     

        .modal-container {
          background: white;
          width: 100%;
          max-width: 500px;
          max-height: 500px;
          overflow-y: auto;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transform: scale(0.95);
          transition: transform 0.3s ease;
          margin: 1rem;
        }

        .scale-in {
          transform: scale(1);
        }

        .scale-out {
          transform: scale(0.95);
        }

        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper svg {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .label-with-tooltip {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .tooltip-wrapper {
          position: relative;
          cursor: pointer;
        }

        .tooltip-text {
          display: none;
          position: absolute;
          left: 0;
          top: 130%;
          width: 250px;
          background: #333;
          color: white;
          padding: 0.5rem;
          font-size: 12px;
          border-radius: 4px;
          z-index: 10;
        }

        .tooltip-wrapper:hover .tooltip-text {
          display: block;
        }

        .note-box {
          padding: 1rem;
          background: #ebf8ff;
          border: 1px solid #bee3f8;
          border-radius: 5px;
          margin-top: 1rem;
          font-size: 14px;
          color: #2c5282;
        }

        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #e5e5e5;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          background: #f9fafb;
        }

        .btn {
          padding: 0.5rem 1rem;
          font-weight: 500;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }

        .btn.cancel {
          background: white;
          border: 1px solid #ccc;
        }

        .btn.save {
          background:rgba(7, 9, 14, 0.91);
          color: white;
        }

        .btn.save:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }

        body.modal-open {
          overflow: hidden;
        }
        `}
      </style>

      <div
        className={`modal-overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleOverlayClick}
      >
        <div className={`modal-container ${isVisible ? 'scale-in' : 'scale-out'}`}>
          <div className="modal-header">
            <h2>Edit Campaign</h2>
            <button onClick={handleClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="campaign-name">Campaign name</label>
              <input
                type="text"
                id="campaign-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="market">Select Market</label>
              <div className="select-wrapper">
                <select id="market" name="market" value={formData.market} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Houston - TX">Houston - TX</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="California">California</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-tooltip">
                <label htmlFor="forwarding-number">Call Forwarding Number</label>
                <div className="tooltip-wrapper">
                  <Info size={16} />
                  <div className="tooltip-text">Phone number where calls will be forwarded to</div>
                </div>
              </div>
              <input
                type="text"
                id="forwarding-number"
                name="callForwardingNumber"
                placeholder="(___) ___-____"
                value={formData.callForwardingNumber}
                onChange={handleChange}
              />
            </div>

            {campaign.isFollowUp && (
              <div className="note-box">
                <strong>Note:</strong> This is a follow-up campaign.
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn cancel" onClick={handleClose}>Cancel</button>
            <button
              className="btn save"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.market || !formData.callForwardingNumber}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCampaignModal;
