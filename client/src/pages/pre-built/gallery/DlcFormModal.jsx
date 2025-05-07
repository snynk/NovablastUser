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
import { useForm } from "react-hook-form";
import axios from "axios";


const DlcFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    taxId: '',
    websiteUrl: '',
    brandName: '',
    email: '',
    firstName: '',
    lastName: '',
    verticalType: '',
    zip: '',
    phoneNumber: '',
    state: '',
  });

  const handleSubmit = async () => {
    try {
      await axios.post("/api/markets/create", formData);
      onClose();
    } catch (error) {
      console.error("Error submitting 10DLC form:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registration Info" className="modal-6">
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Market Name <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter Market Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      
      <div className="form-group">
        <label className="form-label">What Type of legal form is the org? <span className="required">*</span></label>
        <div className="select-container">
          <input type="text" className="form-input" placeholder="Sole proprietorship:" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} readOnly />
          {/* <span className="dropdown-icon">▼</span> */}
        </div>
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Tax Number / ID / EIN <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter Ein" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
      </div>
      
      <div className="form-group">
        <label className="form-label">Website URL <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter URL" value={formData.websiteUrl} onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} />
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">First Name <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
      </div>
      
      <div className="form-group">
        <label className="form-label">Last Name <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">DBA or Brand Name <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter Name" value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} />
      </div>
      
      <div className="form-group">
        <label className="form-label">Email <span className="required">*</span></label>
        <input type="email" className="form-input" placeholder="Enter Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Vertical type</label>
        <div className="select-container">
          <input type="text" className="form-input" placeholder="Select" value={formData.verticalType} onChange={(e) => setFormData({ ...formData, verticalType: e.target.value })} readOnly />
          {/* <span className="dropdown-icon">▼</span> */}
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">ZIP <span className="required">*</span></label>
        <input type="text" className="form-input" placeholder="Enter ZIP" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Phone Number <span className="required">*</span></label>
        <div className="phone-input">
          <div className="country-code">
            <span className="flag">🇺🇸</span>
            <span>+1</span>
          </div>
          <input type="text" className="form-input" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">State <span className="required">*</span></label>
        <div className="phone-input">
          <div className="country-code">
            <span className="flag">🇺🇸</span>
          </div>
          <input type="text" className="form-input" placeholder="Enter State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
        </div>
      </div>
    </div>
    
    <div className="modal-footer">
      <button className="cancel-button" onClick={onClose}>Cancel</button>
      <button className="submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  </Modal>
);
};

export default DlcFormModal;
