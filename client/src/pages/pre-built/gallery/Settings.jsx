import React, { useState, useEffect } from "react";
import "@/assets/css/settings.css";
import axios from "axios";
import MarketsTabContent from "./MarketsTabContent";
import DoNotCallsTabContent from "./DoNotCallsTabContent";
import TagsTabContent from "./TagsTabContent";
import ComingSoonTabContent from "./ComingSoonTabContent";
import RequestNewMarketModal from "./RequestNewMarketModal";
import EditMarketModal from "./EditMarketModal";
import DlcFormModal from "./DlcFormModal";
import RequestNewDncModal from "./RequestNewDncModal";
import EditDncModal from "./EditDncModal";
import RequestNewTagModal from "./RequestNewTagModal"; 
import EditTagModal from "./EditTagModal";



const SettingsScreen = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [dncEntries, setDncEntries] = useState([]);
  const [selectedDncEntry, setSelectedDncEntry] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeTab, setActiveTab] = useState("markets"); 
  const [isModalOpen, setIsModalOpen] = useState({ market: false, dlc: false, editmarket: false, dnc: false, editdnc: false, 
    tag: false, edittag: false  });
  useEffect(() => {
    fetchMarkets();
    fetchDncEntries(); // ✅ Fetch DNC entries on mount
    fetchTags(); 
  }, []);

  const fetchMarkets = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/markets/getmarket");
      setMarkets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };
   // **Fetch DNC Entries**
   const fetchDncEntries = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/blocked/all");
      setDncEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching DNC entries:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/tags/all");
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const tabs = [
    { id: "markets", label: "Markets & Limits" },
    { id: "dnc", label: "Do Not Calls" },
    { id: "tags", label: "Tags" },
    { id: "export", label: "Export Prospects" },
    { id: "integrations", label: "Integrations" },
  ];

  const renderTabContent = () => {
    const tabComponents = {
      markets: <MarketsTabContent markets={markets} fetchMarkets={fetchMarkets} 
        onOpenMarketModal={() => setIsModalOpen({ ...isModalOpen, market: true })} 
        onOpenEditMarketModal={(market) => { setSelectedMarket(market); setIsModalOpen({ ...isModalOpen, editmarket: true }); }}
                 onOpenDlcForm={() => setIsModalOpen({ ...isModalOpen, dlc: true })} 
      />,
      dnc: <DoNotCallsTabContent dncEntries={dncEntries} fetchDncEntries={fetchDncEntries}
        onOpenDncModal={() => setIsModalOpen({ ...isModalOpen, dnc: true })}
        onOpenEditDncModal={(entry) => { setSelectedDncEntry(entry); setIsModalOpen({ ...isModalOpen, editdnc: true }); }}
      />,
      tags: <TagsTabContent tags={tags} fetchTags={fetchTags}
      onOpenTagModal={() => setIsModalOpen({ ...isModalOpen, tag: true })}
      onOpenEditTagModal={(tag) => { setSelectedTag(tag); setIsModalOpen({ ...isModalOpen, edittag: true }); }}
    />,
      export: <ComingSoonTabContent feature="Export Prospects" />,
      integrations: <ComingSoonTabContent feature="Integrations" />,
    };

    return tabComponents[activeTab] || <div className="tab-content-placeholder"></div>;
  };

  return (
    <div className="settings-container">
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 
          className="dashboard-title" 
          style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '100px 20px 10px' }}
        >
          Settings
        </h1>
        <div 
          style={{ 
            height: '4px', 
            width: '70px', 
            backgroundColor: '#22c55e',
            borderRadius: '9999px',
            marginLeft: '20px'
          }} 
        />
      </div>

      <div className="tabs-container">
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

      {/* Modals */}
      <RequestNewMarketModal isOpen={isModalOpen.market} onClose={() => setIsModalOpen({ ...isModalOpen, market: false })} fetchMarkets={fetchMarkets} />
      <EditMarketModal isOpen={isModalOpen.editmarket} onClose={() => setIsModalOpen({ ...isModalOpen, editmarket: false })} marketData={selectedMarket} fetchMarkets={fetchMarkets} />
      <DlcFormModal isOpen={isModalOpen.dlc} onClose={() => setIsModalOpen({ ...isModalOpen, dlc: false })} fetchMarkets={fetchMarkets} />
      <RequestNewDncModal isOpen={isModalOpen.dnc} onClose={() => setIsModalOpen({ ...isModalOpen, dnc: false })} fetchDncEntries={fetchDncEntries} />
      <EditDncModal 
  isOpen={isModalOpen.editdnc} 
  onClose={() => setIsModalOpen({ ...isModalOpen, editdnc: false })} 
  dncData={selectedDncEntry} 
  fetchDncEntries={fetchDncEntries} 
/>
<RequestNewTagModal isOpen={isModalOpen.tag} onClose={() => setIsModalOpen({ ...isModalOpen, tag: false })} fetchTags={fetchTags} />
<EditTagModal isOpen={isModalOpen.edittag} onClose={() => setIsModalOpen({ ...isModalOpen, edittag: false })} tagData={selectedTag} fetchTags={fetchTags} />

    </div>
  );
};

export default SettingsScreen;
