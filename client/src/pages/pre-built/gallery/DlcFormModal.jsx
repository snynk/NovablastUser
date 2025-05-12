import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const initialData = {
  locatedInUSOrCanada: '',
  hasTaxId: '',
  legalBusinessName: '', businessType: '', businessRegistrationIdType: '', businessRegistrationNumber: '', businessIndustry: '', businessEmail: '', websiteURL: '', businessRegionOfOperations: '',
  country: '', streetAddress: '', city: '', stateProvinceRegion: '', postalZipCode: '',
  firstName: '', lastName: '', emailAddress: '', phoneNumber: '', jobPosition: '',
};

const steps = [
  {
    title: 'Profile Needs',
    fields: [
      ['locatedInUSOrCanada', 'Is the business entity you’re registering located in the US and/or Canada?'],
      ['hasTaxId', 'Does the business you’re registering have a tax ID (Ex. US EIN, Canada BN9)?'],
    ],
  },
  {
    title: 'Business Details',
    fields: [
      ['legalBusinessName', 'Legal Business Name *'],
      ['businessType', 'Business Type *'],
      ['businessRegistrationIdType', 'Registration ID Type *'],
      ['businessRegistrationNumber', 'Registration Number *'],
      ['businessIndustry', 'Industry *'],
      ['businessEmail', 'Business Email *'],
      ['websiteURL', 'Website URL *'],
      ['businessRegionOfOperations', 'Region of Operations'],
    ],
  },
  {
    title: 'Business Address',
    fields: [
      ['country', 'Country *'],
      ['streetAddress', 'Street Address *'],
      ['city', 'City *'],
      ['stateProvinceRegion', 'State/Province/Region *'],
      ['postalZipCode', 'Postal/Zip Code *'],
    ],
  },
  {
    title: 'Contact Info',
    fields: [
      ['firstName', 'First Name *'],
      ['lastName', 'Last Name *'],
      ['emailAddress', 'Email Address *'],
      ['phoneNumber', 'Phone Number *'],
      ['jobPosition', 'Job Position'],
    ],
  },
];

const requiredFields = new Set([
  'legalBusinessName', 'businessType', 'businessRegistrationIdType', 'businessRegistrationNumber', 'businessIndustry', 'businessEmail', 'websiteURL',
  'country', 'streetAddress', 'city', 'stateProvinceRegion', 'postalZipCode',
  'firstName', 'lastName', 'emailAddress', 'phoneNumber',
]);

const DlcFormModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setFormData(initialData);
    }
  }, [isOpen]);

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const isStepValid = () =>
    steps[step].fields.every(([name]) =>
      !requiredFields.has(name) || formData[name].trim() !== ''
    );

  const next = () => isStepValid() && setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = e => {
    e.preventDefault();
    if (isStepValid()) {
      console.log('Submitted:', formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DLC Form">
      {/* Tabs */}
      <div className="step-navigation">
        {steps.map((s, i) => (
          <button key={i} type="button" className={`step-button ${i === step ? 'active' : ''}`} onClick={() => setStep(i)}>
            {s.title}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-container">
        {step === 0 && (
          <>
            <div className="info-box success">
              <strong>Profile Submitted — Proceed to Next Step</strong>
              <p>Your Business Profile has already been submitted, so there is no need to take any action on this page. Please click "Continue" to proceed next.</p>
            </div>

            <div className="info-box warning">
              <strong>Notice for US or Canadian customers with Tax ID!</strong>
              <ul>
                <li>US or Canadian customers who have a Tax ID (EIN or BN9) need to register for a Low Volume Standard or Standard brand to send messages to the US.</li>
                <li>US or Canadian customers who do not have a tax ID, need to register for the same on the <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">IRS site</a> or <a href="https://www.canada.ca/en/revenue-agency.html" target="_blank" rel="noopener noreferrer">CRA site</a>.</li>
                <li>All other non US/Canadian customers would need to register for a Low Volume Standard or Standard brand using their local Business Registration Number.</li>
              </ul>
            </div>
          </>
        )}

        <div className="form-grid">
          {steps[step].fields.map(([name, label]) => {
            if (step === 0) {
              return (
                <div key={name} className="form-group full-width">
                  <label className="form-label">{label}</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name={name}
                        value="yes"
                        checked={formData[name] === 'yes'}
                        onChange={handleChange}
                        disabled={name === 'hasTaxId'}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={name}
                        value="no"
                        checked={formData[name] === 'no'}
                        onChange={handleChange}
                        disabled={name === 'hasTaxId'}
                      /> No
                    </label>
                  </div>
                </div>
              );
            }

            return (
              <div key={name} className="form-group half-width">
                <label className="form-label">{label}</label>
                <input
                  type={name.includes('email') ? 'email' : name.includes('phone') ? 'tel' : 'text'}
                  name={name}
                  className="form-input"
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.replace('*', '').trim()}`}
                />
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          {step > 0 && <button type="button" className="cancel-button" onClick={prev}>Previous</button>}
          {step < steps.length - 1 ? (
            <button type="button" className="save-button" onClick={next} disabled={!isStepValid()}>Continue</button>
          ) : (
            <button type="submit" className="save-button" disabled={!isStepValid()}>Submit</button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DlcFormModal;
