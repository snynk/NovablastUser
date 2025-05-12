import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import {
  Col,
  Button,
  RSelect,
} from "@/components/Component";
import axios from "axios";

const EditDncModal  = ({ isOpen, onClose, dncData, fetchDncEntries  }) => {

  const defaultFormState  ={ phoneNumber: ''};
  const [formData, setFormData] = useState(defaultFormState);

   // **Reset form when modal opens**
   useEffect(() => {
    if (isOpen && dncData) {
      setFormData({ phoneNumber: dncData.phoneNumber || "" });
    }
  }, [isOpen, dncData]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/blocked/${dncData._id}`, formData);
  
      fetchDncEntries(); // ✅ Instantly refresh market table after edit
      onClose(); // ✅ Close modal after update
    } catch (error) {
      console.error("Error updating DNC entry:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit DNC Entry" className="modal-5">
           {/* <div className="info-banner">
             <span className="info-icon">ℹ️</span>
             <p>Please note that this number/user will be charged according to your current subscription</p>
             <button className="accept-button">Accept</button>
           </div> */}
           
           <div className="form-row">
             <div className="form-group">
               <label className="form-label">Enter Mobile Number<span className="required">*</span></label>
               <input type="text" className="form-input" placeholder="Enter Mobile Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
             </div>
             
           </div>
           
           
           
           <div className="modal-footer">
           <Button color="secondary" onClick={onClose}>Cancel</Button>
   <Button color="primary" onClick={handleSubmit}>Save</Button>
   
           </div>
         </Modal>
  );
};

export default EditDncModal;
