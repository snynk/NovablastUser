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
import { useForm } from "react-hook-form";
import axios from "axios";
// Dynamic Options for Legal Form
const legalFormOptions = [
  { label: "Publicly Traded Company", value: "public_company" },
  { label: "Private Company", value: "private_company" },
  { label: "Non-Profit Company", value: "non_profit" },
  { label: "Government", value: "government" },
  { label: "Sole Proprietor", value: "sole_proprietor" },
];

// Dynamic Options for Vertical Type
const verticalTypeOptions = [
  { label: "Real Estate", value: "real_estate" },
  { label: "Energy & Utilities", value: "energy_utilities" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Retail", value: "retail" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Insurance", value: "insurance" },
  { label: "Financial Services", value: "financial_services" },
  { label: "Government Lottery", value: "government_lottery" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Hospitality & Travel", value: "hospitality_travel" },
  { label: "Non-Government Organization", value: "ngo" },
];

// Full USA State List
const stateOptions = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];


const DlcFormModal = ({ isOpen, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
const loggedInCustomerId = user && user.id ? user.id : null;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    marketname: '',
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        customerId: loggedInCustomerId, // Attach customer ID
      };
      await axios.post("http://localhost:3000/api/markets/create", payload);
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
        <input type="text" className="form-input" placeholder="Enter Market Name" value={formData.marketname} onChange={(e) => setFormData({ ...formData, marketname: e.target.value })} />
      </div>
      
      <div className="form-group">
        <label className="form-label">What Type of legal form is the org? <span className="required">*</span></label>
        <div className="select-container">
          {/* <input type="text" className="form-input" placeholder="Sole proprietorship:" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} readOnly /> */}
          <RSelect options={legalFormOptions} onChange={(e) => handleChange("businessType", e.value)} />
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
          {/* <input type="text" className="form-input" placeholder="Select" value={formData.verticalType} onChange={(e) => setFormData({ ...formData, verticalType: e.target.value })} readOnly /> */}
          {/* <span className="dropdown-icon">▼</span> */}
          <RSelect options={verticalTypeOptions} onChange={(e) => handleChange("verticalType", e.value)} />
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
          <RSelect options={stateOptions} onChange={(e) => handleChange("state", e.value)} />
        </div>
      </div>
    </div>
    
    <div className="modal-footer">
    <Button color="secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Cancel</Button>
<Button color="primary" onClick={(e) => { e.preventDefault(); handleSubmit(); }}>Save Changes</Button>

    </div>
  </Modal>
);
};

export default DlcFormModal;
