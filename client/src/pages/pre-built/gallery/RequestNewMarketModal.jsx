import React, { useState, useEffect } from "react";

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

const RequestNewMarketModal = ({ isOpen, onClose, fetchMarkets }) => {
  // const defaultFormState = { name: '', callForwardingNumber: '', areaCode: '', timeZone: '', status: 'Pending' };
  const defaultFormState = { name: '', areaCode: '', timeZone: '', status: 'Pending' };
  const user = JSON.parse(localStorage.getItem("user"));
const loggedInCustomerId = user && user.id ? user.id : null;


    const [formData, setFormData] = useState(defaultFormState);
  
// **Reset form data when modal opens**
React.useEffect(() => {
  if (isOpen) setFormData(defaultFormState);
}, [isOpen]);


    const handleSubmit = async () => {
        try {
          const payload = {
            ...formData,
            customerId: loggedInCustomerId, // Attach customer ID
          };
            await axios.post(`http://localhost:3000/api/markets/createmarket`, payload);
            fetchMarkets();
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
            <label className="form-label">Area Code <span className="required">*</span></label>
            <div className="select-container">
          
              {/* <span className="dropdown-icon">▼</span> */}
              <input type="text" className="form-input" value={formData.areaCode} onChange={(e) => setFormData({ ...formData, areaCode: e.target.value })} />
            </div>
          </div>
          
         
        </div>
        
        <div className="form-row">

           {/* <div className="form-group">
            <label className="form-label">Call Forwarding Number <span className="required">*</span></label>
            <div className="phone-input">
              <div className="country-code">
                <span className="flag">🇺🇸</span>
                <span>+1</span>
              </div>
              <input type="text" className="form-input" value={formData.callForwardingNumber} onChange={(e) => setFormData({ ...formData, callForwardingNumber: e.target.value })} />
            </div>
          </div> */}
          
          
          <div className="form-group">
            <label className="form-label">Time Zone</label>
            <input type="text" className="form-input" value={formData.timeZone} onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}  />
          </div>
        </div>
        
        <div className="modal-footer">
        <Button color="secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Cancel</Button>
<Button color="primary" onClick={(e) => { e.preventDefault(); handleSubmit(); }}>Save</Button>

        </div>
      </Modal>
    );
  };

export default RequestNewMarketModal;
