import React, { useState } from 'react';
import { AlertCircle, CreditCard, ChevronDown, ChevronRight, Check, X } from 'lucide-react';
import PaymentsTab from './PaymentsTab';
import "@/assets/css/BillingDashboard.css";

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [paymentView, setPaymentView] = useState('monthly');
    const [showDowngradeModal, setShowDowngradeModal] = useState(false);


  // Tabs data
  const tabs = [
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'payments', label: 'Payments' }
  ];

  // Plan data
  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 97,
      yearlyPrice: 970,
      features: [
        'Unlimited Users',
        'Three Accounts',
        'No SaaS',
        'Workflow Builder',
        'Campaign Builder',
        '2 way SMS',
        '2 Way Email',
        'App Marketplace for Agency & Sub-accounts'
      ]
    },
    {
      name: 'Freelancer',
      monthlyPrice: 297,
      yearlyPrice: 2970,
      current: true,
      features: [
        'Unlimited Users',
        'Unlimited Account',
        'No SaaS',
        'Everything in Starter plus...',
        'Whitelabel Desktop',
        'Memberships',
        'Chat Support',
        'Phone Support',
        'Partner Program'
      ]
    },
    {
      name: 'Agency Pro',
      monthlyPrice: 497,
      yearlyPrice: 4970,
      recommended: true,
      features: [
        'Unlimited Users',
        'Unlimited Account',
        'Unlimited SaaS',
        'Everything in Freelancer plus...',
        'SaaS Mode',
        'Custom Objects',
        'Email / Phone / Text Routing',
        'Split Testing',
        'Agent Reporting'
      ]
    }
  ];

  const renderSubscriptionsTab = () => (
    <div className="account-card">
      <div className="account-info">
        <h2>Freelancer Account</h2>
        <p>Manage your plan</p>
      </div>
      <div className="price">
        <h2>$297</h2>
        <h6>per month</h6>
      </div>
      
      {/* <div className="promo-card">
        <div className="promo-icon">
          <CreditCard size={20} className="icon" />
        </div>
        <div className="promo-text">
          <p>Claim your 2 Free Months</p>
          <small>Get 2 months free, if you upgrade to annual subscription</small>
        </div>
        <button className="button primary-button">Claim Now</button>
      </div> */}
      
      <div className="actions-row">
        <button 
          className="action-button" 
          onClick={() => setShowModifyModal(true)}
          
        >
          <span>Want to modify / cancel your subscription?</span>
          <ChevronRight size={18} />
        </button>
        
         <button 
          className="action-button" 
          // onClick={() => setShowDowngradeModal(true)}
        >
          <span>Have a Billing Question?</span>
          <p className="secondary-text">Contact us at +1(888)732-4197</p>
        </button>
      </div>
      
      <div className="invoice-info">
        <p>Your next invoice is scheduled on Jun 5, 2025</p>
      </div>
    </div>
  );


   const DowngradeModal = () => (
    <div className="modal-overlay17" onClick={() => setShowDowngradeModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Downgrade Your Plan</h2>
          <button className="close-button" onClick={() => setShowDowngradeModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <h6>If you wish to move to a lower plan, you can downgrade your subscription to $97 / month.</h6>
          <br></br>
      
          <textarea className="reason-input" placeholder="Tell us why you want to downgrade..."></textarea>
          <div className="checkbox-group">
            <label><input type="checkbox" /> I understand that I can use only 3 sub-accounts on the $97/month plan.</label>
            <label><input type="checkbox" /> I confirm that I have deleted all excess sub-accounts.</label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="primary-button">Downgrade to $97 / month</button>
        </div>
      </div>
    </div>
  );
  // Modal component for plan modification
  const ModifyModal = () => (
    <div className="modal-overlay16" onClick={() => setShowModifyModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Modify subscription for Legacy Home Improvements</span>
          <button className="close-button" onClick={() => setShowModifyModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-subtitle">Hold up! Did you know about the options below?</p>
          
          <div className="modal-option">
            <div className="option-icon upgrade">
              <Check size={18} />
            </div>
            <div className="option-text">
              <b>Upgrade your current plan</b>
              <h6 className="price">$297 / month</h6>
            </div>
            <button className="button primary-button" onClick={() => {
              setShowModifyModal(false);
              setShowUpgradeModal(true);
            }}>Upgrade</button>
          </div>
          
          <div className="modal-option" onClick={() => setShowDowngradeModal(true)}>
            <div className="option-icon downgrade">
              <AlertCircle size={18} />
            </div>
            <div className="option-text">
              <p>Downgrade Plan</p>
              <p className="secondary-text">I wish to downgrade my subscription to a lower plan</p>
            </div>
            <ChevronRight size={18} />
          </div>
        </div>  
      </div>
    </div>
  );

  // Modal component for plan upgrade
  const UpgradeModal = () => (
    <div className="modal-overlay16" onClick={() => setShowUpgradeModal(false)}>
      <div className="modal-content upgrade-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upgrade your plan</h2>
          <button className="close-button" onClick={() => setShowUpgradeModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="upgrade-subtitle">
          <div className="option-icon upgrade">
            <Check size={18} />
          </div>
          <h5>Flexible pricing that grows with you.</h5>
        </div>
        
        <div className="billing-toggle">
          <button 
            className={`toggle-button ${paymentView === 'monthly' ? 'active' : ''}`}
            onClick={() => setPaymentView('monthly')}>
            Pay Monthly
          </button>
          <button 
            className={`toggle-button ${paymentView === 'annually' ? 'active' : ''}`}
            onClick={() => setPaymentView('annually')}>
            Pay Annually
          </button>
        </div>
        
        <div className="plans-container">
          {plans.map(plan => (
            <div key={plan.name} className={`plan-card ${plan.current ? 'current' : ''} ${plan.recommended ? 'recommended' : ''}`}>
              {plan.recommended && <div className="recommendation-tag">Recommended Plan</div>}
              {plan.current && <div className="current-tag">Current Plan</div>}
              
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <h2>${paymentView === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</h2>
                <h6>{paymentView === 'monthly' ? 'per month' : 'per year'}</h6>
              </div>
              <p className="payment-detail">
                You pay just ${paymentView === 'monthly' ? plan.monthlyPrice : `${Math.round(plan.yearlyPrice/12)} $${plan.monthlyPrice}/month`}
              </p>
              <p className="billing-cycle">Billed {paymentView === 'monthly' ? 'monthly' : 'annually'}</p>
              
              <button className="details-link">Check more details below <ChevronDown size={16} /></button>
              
              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={16} className="feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {!plan.current && (
                <button className={`button ${plan.recommended ? 'primary-button' : 'secondary-button'}`}>
                  {plan.recommended ? 'Upgrade Now' : plan.monthlyPrice < 297 ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container9">
      <header className="dashboard-header">
        <h1>Billing Dashboard</h1>
        <nav className="tabs-navigation">
          <ul className="tabs-list">
            {tabs.map(tab => (
              <li 
                key={tab.id} 
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="dashboard-content ">
        {activeTab === 'subscriptions' && renderSubscriptionsTab()}
        {activeTab === 'payments' && <PaymentsTab setShowModifyModal={setShowModifyModal} />}
      </main>

      {showModifyModal && <ModifyModal />}
      {showUpgradeModal && <UpgradeModal />}
            {showDowngradeModal && <DowngradeModal />}

    </div>
  );
};

export default BillingDashboard;