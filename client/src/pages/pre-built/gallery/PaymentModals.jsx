import React, { useState } from 'react';
import { X, ChevronDown, CreditCard } from 'lucide-react';


const PaymentModals = ({ isOpen, onClose, modalType, onAddNewCard }) => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay16">
      {modalType === 'manage' ? (
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Manage your payment methods</h3>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-subtitle">Set primary card or add/delete cards</div>
            
            <div className="payment-card">
              <div className="card-logo">VISA</div>
              <div className="card-details">
                <p>Visa **** 6539 <span className="tag">Primary Card</span></p>
                <small>Expires 5/2030</small>
              </div>
              <div></div>
            </div>
            
            <div className="payment-card">
              <div className="card-logo">VISA</div>
              <div className="card-details">
                <p>Visa **** 5933</p>
                <small>Expires 5/2030</small>
              </div>
              <button className="icon-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="#64748B" />
                  <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="#64748B" />
                  <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="#64748B" />
                </svg>
              </button>
            </div>
            
            <button className="add-card-button" onClick={onAddNewCard}>
              <span className="add-icon">+</span>
              Add New Card
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Add new payment method</h3>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-subtitle">Please provide the below details.</div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <div className="card-input-container">
                <input
                  type="text"
                  id="cardNumber"
                  className="form-input"
                  placeholder="1234 1234 1234 1234"
                />
                <div className="card-icons">
                  <img src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-1024.png" alt="Visa" className="card-icon" />
                  <img src="https://www.svgrepo.com/show/452059/mastercard.svg" alt="Mastercard" className="card-icon" />
                  <img src="https://www.svgrepo.com/show/14823/amex.svg" alt="American Express" className="card-icon" />
                  <img src="https://www.svgrepo.com/show/328151/discover.svg" alt="Discover" className="card-icon" />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="expiryDate">Expiration Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="form-input"
                  placeholder="MM / YY"
                />
              </div>
              <div className="form-group half">
                <label htmlFor="securityCode">Security Code</label>
                <div className="security-code-container">
                  <input
                    type="text"
                    id="securityCode"
                    className="form-input"
                    placeholder="CVC"
                  />
                  <div className="cvv-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#64748B" strokeWidth="2" />
                      <path d="M3 10H21" stroke="#64748B" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <div className="country-select" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                <span>{selectedCountry}</span>
                <ChevronDown size={16} />
                {showCountryDropdown && (
                  <div className="country-dropdown">
                    <div className="country-option" onClick={() => setSelectedCountry('India')}>India</div>
                    <div className="country-option" onClick={() => setSelectedCountry('United States')}>United States</div>
                    <div className="country-option" onClick={() => setSelectedCountry('United Kingdom')}>United Kingdom</div>
                    <div className="country-option" onClick={() => setSelectedCountry('Canada')}>Canada</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="terms-text">
              By providing your card information, you allow HighLevel Inc. to charge your
              card for future payments in accordance with their terms.
            </div>
            
            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose}>Cancel</button>
              <button className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModals;