import React, { useState } from 'react';
import "@/assets/css/settings.css";
import MarketsTabContent from "./MarketsTabContent";
import DoNotCallsTabContent from "./DoNotCallsTabContent";
import TagsTabContent from "./TagsTabContent";
import ComingSoonTabContent from "./ComingSoonTabContent";
import RequestNewMarketModal from "./RequestNewMarketModal";
import DlcFormModal from "./DlcFormModal";

const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [isModalOpen, setIsModalOpen] = useState({ market: false, dlc: false });

  const tabs = [
    { id: 'markets', label: 'Markets & Limits' },
    { id: 'dnc', label: 'Do Not Calls' },
    { id: 'tags', label: 'Tags' },
    { id: 'export', label: 'Export Prospects' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const renderTabContent = () => {
    const tabComponents = {
      markets: <MarketsTabContent 
      onOpenMarketModal={() => setIsModalOpen({ ...isModalOpen, market: true })} 
      onOpenDlcForm={() => setIsModalOpen({ ...isModalOpen, dlc: true })}
   />,
      dnc: <DoNotCallsTabContent />,
      tags: <TagsTabContent />,
      export: <ComingSoonTabContent feature="Export Prospects" />,
      integrations: <ComingSoonTabContent feature="Integrations" />,
    };
    return tabComponents[activeTab] || <div className="tab-content-placeholder"></div>;
  };

  return (
    <div className="settings-container">
      <div className="header-section">
        <h1 className="dashboard-title">Settings</h1>
        <div className="highlight-bar" />
      </div>

      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

      {/* Modals */}
      <RequestNewMarketModal isOpen={isModalOpen.market} onClose={() => setIsModalOpen({ ...isModalOpen, market: false })} />
      <DlcFormModal isOpen={isModalOpen.dlc} onClose={() => setIsModalOpen({ ...isModalOpen, dlc: false })} />
    </div>
  );
};

export default SettingsScreen;
