import React, { useState, useEffect } from "react";
import { Modal, Button } from "reactstrap";
import axios from "axios";

const EditTagModal = ({ isOpen, onClose, tagData, fetchTags }) => {
  const defaultFormState = { name: "", color: "#000000" };
  const [formData, setFormData] = useState(defaultFormState);

  // **Reset form when modal opens**
  useEffect(() => {
    if (isOpen && tagData) {
      setFormData({ name: tagData.name || "", color: tagData.color || "#000000" });
    }
  }, [isOpen, tagData]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/tags/${tagData._id}`, formData);
      fetchTags(); // ✅ Instantly refresh tag list
      onClose(); // ✅ Close modal after update
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tag" className="modal-5">
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
        <Button color="primary" onClick={handleSubmit}>Save Changes</Button>
      </div>
    </Modal>
  );
};

export default EditTagModal;
