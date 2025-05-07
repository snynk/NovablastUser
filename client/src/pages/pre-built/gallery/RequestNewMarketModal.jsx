import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import {
  Icon,
  Col,
  Button,
  RSelect,
} from "@/components/Component";
import axios from "axios";

import { useForm } from "react-hook-form";

const RequestNewMarketModal = ({ isOpen, onClose }) => {

    const [formData, setFormData] = useState({ name: '', callForwardingNumber: '', areaCode: '', timeZone: '', status: 'Pending' });
      
    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:3000/api/markets/createmarket`, formData);

          onClose();
        } catch (error) {
          console.error("Error submitting market  form:", error);
        }
      };
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Request New Market" className="modal-5">
        {/* <div className="info-banner">
          <span className="info-icon">ℹ️</span>
          <p>Please note that this number/user will be charged according to your current subscription</p>
          <button className="accept-button">Accept</button>
        </div> */}
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Market Name <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Call Forwarding Number <span className="required">*</span></label>
            <div className="phone-input">
              <div className="country-code">
                {/* <span className="flag">🇺🇸</span>
                <span>+1</span> */}
              </div>
              <input type="text" className="form-input" value={formData.callForwardingNumber} onChange={(e) => setFormData({ ...formData, callForwardingNumber: e.target.value })} />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Area Code <span className="required">*</span></label>
            <div className="select-container">
              <input type="text" className="form-input" placeholder="Search..." value={formData.areaCode} onChange={(e) => setFormData({ ...formData, areaCode: e.target.value })} />
              {/* <span className="dropdown-icon">▼</span> */}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Time Zone</label>
            <input type="text" className="form-input" value={formData.timeZone} onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}  />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSubmit} >Save</button>
        </div>
      </Modal>
    );
  };

export default RequestNewMarketModal;
