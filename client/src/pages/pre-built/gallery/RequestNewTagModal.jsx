import React, { useState, useEffect } from "react";
import { Modal, Button } from "reactstrap";
import axios from "axios";

const RequestNewTagModal = ({ isOpen, onClose, fetchTags }) => {
  const defaultFormState = { name: "", color: "#000000" }; // Default color set to black
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInCustomerId = user && user.id ? user.id : null;
  const [formData, setFormData] = useState(defaultFormState);

  // **Reset form data when modal opens**
  useEffect(() => {
    if (isOpen) setFormData(defaultFormState);
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      if (!formData.name) {
        alert("Please enter a tag name"); // 🚨 Prevent empty submission
        return;
      }

      const payload = { ...formData, customerId: loggedInCustomerId };
      await axios.post("http://localhost:3000/api/tags/create", payload);

      fetchTags(); // ✅ Instantly refresh tag list
      onClose();
    } catch (error) {
      console.error("Error submitting tag:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Tag" className="modal-5">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tag Name <span className="required">*</span></label>
          <input type="text" className="form-input" placeholder="Enter Tag Name" 
                 value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Tag Color</label>
          <input type="color" className="form-input" value={formData.color} 
                 onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
        </div>
      </div>

      <div className="modal-footer">
        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default RequestNewTagModal;
