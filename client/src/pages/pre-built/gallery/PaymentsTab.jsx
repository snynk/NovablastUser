import React, { useState } from 'react';
import { Edit, X } from 'lucide-react';
import PaymentModals from './PaymentModals';
import "@/assets/css/PaymentsPage.css";
// import "./PaymentModals.css";

const PaymentsPage = () => {
  const [paymentView, setPaymentView] = useState('charges');
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  const handleEditClick = () => {
    setShowManageModal(true);
  };
  
  const handleAddNewCard = () => {
    setShowManageModal(false);
    setShowAddCardModal(true);
  };
  
  // This would be called from inside the modal when clicking the "Add New Card" button
  const openAddCardModal = () => {
    setShowManageModal(false);
    setShowAddCardModal(true);
  };

  return (
    <>
      <div className="payments-container">
        <div className="payment-section">
          <div className="section-header">
            <h2>Payment Method</h2>
            <button className="icon-button" onClick={handleEditClick}>
              <Edit size={18} />
            </button>
          </div>
          <div className="payment-card">
<div className="card-logo">
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
    alt="VISA Logo" 
  />
</div>
            <div className="card-details">
              <p>Visa **** 6539 <span className="tag">Primary Card</span></p>
              <small>Expires 5/2030</small>
            </div>
          </div>
        </div>
        
        <div className="billing-info-section">
          <h4>Billing Information</h4>
          <div className="billing-card">
            <div className="user-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="address-details">
              <p>Mark White</p>
              <p>8206 ROUGHRIDER DR STE 104, SAN ANTONIO, TX, 78239-2449, US</p>
            </div>
          </div>
        </div>
        
        <div className="payment-history-section">
          <h4>Payments History</h4>
          <p className="section-description">Keep track of your payments</p>
          
          <div className="history-tabs">
            <button 
              className={`tab-button ${paymentView === 'charges' ? 'active' : ''}`}
              onClick={() => setPaymentView('charges')}
            >
              Charges
            </button>
          </div>
          
          <table className="payments-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Description</th>
                <th>Card Details</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td>-</td>
                <td>May 7, 2025</td>
                <td>Auto-Recharge for Agency - Legacy Home Improvements of USD 10 was successfully added to your balance</td>
                <td>Visa ending 6539</td>
                <td>$10</td>
                <td className="success">Successful</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal for managing payment methods */}
      {showManageModal && (
        <PaymentModals 
          isOpen={showManageModal} 
          onClose={() => setShowManageModal(false)} 
          modalType="manage"
          onAddNewCard={openAddCardModal}
        />
      )}
      
      {/* Modal for adding a new card */}
      {showAddCardModal && (
        <PaymentModals 
          isOpen={showAddCardModal} 
          onClose={() => setShowAddCardModal(false)} 
          modalType="add"
        />
      )}
    </>
  );
};

export default PaymentsPage;