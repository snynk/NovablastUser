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

const EditMarketModal = ({ isOpen, onClose, marketData, setMarkets }) => {
//   const [areaCodes, setAreaCodes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    callForwardingNumber: '',
    areaCode: '',
    timeZone: '',
    status: 'Pending',
  });

  useEffect(() => {
    console.log("marketData:", marketData); // Debug log
    if (marketData) {
      setFormData({
        name: marketData.name || "",
        callForwardingNumber: marketData.callForwardingNumber || "",
        areaCode: marketData.areaCode || "",
        timeZone: marketData.timeZone || "",
        status: marketData.status || "Pending",
      });
    }
  }, [marketData]);


const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      const { data } = await axios.put(`http://localhost:3000/api/markets/${marketData._id}`, formData);
  
      // ✅ Update the market list dynamically
      setMarkets((prevMarkets) => prevMarkets.map((market) =>
        market._id === data._id ? data : market // Replace the updated market
      ));
  
      onClose(); // Close modal after update
    } catch (error) {
      console.error("Error updating market:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Market" className="modal-5">
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
             
                 {/* <span className="dropdown-icon">▼</span> */}
                 <input type="text" className="form-input" value={formData.areaCode} onChange={(e) => setFormData({ ...formData, areaCode: e.target.value })} />
               </div>
             </div>
             
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

export default EditMarketModal;
