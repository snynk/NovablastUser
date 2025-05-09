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

const RequestNewDncModal = ({ isOpen, onClose, fetchDncEntries }) => {
  const defaultFormState = { phoneNumber: ''};
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
            await axios.post(`http://localhost:3000/api/blocked/create`, payload);
            fetchDncEntries();
          onClose();
        } catch (error) {
          console.error("Error submitting DNC entry:", error);
        }
      };
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create New DNC Entry" className="modal-5">
        {/* <div className="info-banner">
          <span className="info-icon">ℹ️</span>
          <p>Please note that this number/user will be charged according to your current subscription</p>
          <button className="accept-button">Accept</button>
        </div> */}
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Enter Mobile Number <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter Name" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </div>         
          
        </div>       
       
        
        <div className="modal-footer">
        <Button color="secondary" onClick={onClose}>Cancel</Button>
<Button color="primary" onClick={handleSubmit}>Save</Button>

        </div>
      </Modal>
    );
  };

export default RequestNewDncModal;
