import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import "@/assets/css/campaings.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import the modal components
import CreateCampaignModal from "./CreateCampaignModal";
import CreateFollowUpModal from "./CreateFollowUpModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ViewCampaignModal from "./ViewCampaignModal";
import EditCampaignModal from "./EditCampaignModal";

// Fixed import path to match project structure
import {
  getCampaigns,
  createCampaign,
  createFollowUpCampaign,
  deleteCampaign,
  searchCampaigns,
  getCampaignById,
  updateCampaign
} from '../../../services/campaignService';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFollowUpsOnly, setShowFollowUpsOnly] = useState(false);

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Apply filters when search term or showFollowUpsOnly changes
  useEffect(() => {
    applyFilters();
  }, [campaigns, searchTerm, showFollowUpsOnly]);

  // Fetch campaigns from the API
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
      setFilteredCampaigns(data);
      setTotalPages(Math.ceil(data.length / entriesPerPage));
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to fetch campaigns. Please check your connection and try again.', {
        toastId: 'fetch-error'
      });
    }
  };

  // Apply filters to campaigns
  const applyFilters = () => {
    let result = [...campaigns];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by follow-up status
    if (showFollowUpsOnly) {
      result = result.filter(campaign => campaign.isFollowUp);
    }
    
    setFilteredCampaigns(result);
    setTotalPages(Math.ceil(result.length / entriesPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Search campaigns if no input for a while
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await searchCampaigns(searchTerm, { isFollowUp: showFollowUpsOnly ? true : undefined });
        setFilteredCampaigns(data);
        setTotalPages(Math.ceil(data.length / entriesPerPage));
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        setError(err.toString());
        setLoading(false);
        toast.error('Search failed. Please try again.', {
          toastId: 'search-error'
        });
      }
    } else {
      fetchCampaigns();
    }
  };

  // Handle new campaign creation
  const handleSaveNewCampaign = async (campaignData) => {
    try {
      setLoading(true);
      await createCampaign(campaignData);
      await fetchCampaigns();
      setShowNewCampaignModal(false);
      toast.success(`"${campaignData.name}" campaign created successfully`, {
        toastId: `create-${Date.now()}`
      });
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to create campaign', {
        toastId: `error-create-${Date.now()}`
      });
    }
  };

  // Handle follow-up campaign creation
  const handleSaveFollowUp = async (followUpData) => {
    try {
      setLoading(true);
      await createFollowUpCampaign(followUpData);
      await fetchCampaigns();
      setShowFollowUpModal(false);
      toast.success(`"${followUpData.name}" follow-up campaign created successfully`, {
        toastId: `create-followup-${Date.now()}`
      });
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to create follow-up campaign', {
        toastId: `error-create-followup-${Date.now()}`
      });
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      setLoading(true);
      await deleteCampaign(selectedCampaign._id);
      setShowDeleteModal(false);
      toast.success(`"${selectedCampaign.name}" campaign deleted successfully`, {
        toastId: `delete-${selectedCampaign._id}`
      });
      setSelectedCampaign(null);
      await fetchCampaigns();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to delete campaign', {
        toastId: `error-delete-${Date.now()}`
      });
    }
  };

  // Handle campaign update
  const handleUpdateCampaign = async (updatedData) => {
    if (!selectedCampaign) return;
    
    try {
      setLoading(true);
      await updateCampaign(selectedCampaign._id, updatedData);
      setShowEditModal(false);
      toast.success(`"${updatedData.name || selectedCampaign.name}" campaign updated successfully`, {
        toastId: `update-${selectedCampaign._id}`
      });
      setSelectedCampaign(null);
      await fetchCampaigns();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to update campaign', {
        toastId: `error-update-${Date.now()}`
      });
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  // Open view campaign modal
  const openViewModal = async (campaign) => {
    try {
      setLoading(true);
      // If you need more details than what's in the table
      const campaignDetails = await getCampaignById(campaign._id);
      setSelectedCampaign(campaignDetails);
      setShowViewModal(true);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to load campaign details', {
        toastId: `error-view-${Date.now()}`
      });
    }
  };

  // Open edit campaign modal
  const openEditModal = async (campaign) => {
    try {
      setLoading(true);
      // If you need more details than what's in the table
      const campaignDetails = await getCampaignById(campaign._id);
      setSelectedCampaign(campaignDetails);
      setShowEditModal(true);
      setLoading(false);
    } catch (err) {
      setError(err.toString());
      setLoading(false);
      toast.error('Failed to load campaign details for editing', {
        toastId: `error-edit-${Date.now()}`
      });
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Calculate displayed campaigns based on pagination
  const displayedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <>
      {/* Toast Container - Configure with preventDuplicates */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        limit={1} 
        preventDuplicates
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 
          className="dashboard-title" 
          style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '100px 20px 10px' }}
        >
          Campaigns
        </h1>
        <div 
          style={{ 
            height: '4px', 
            width: '100px', 
            backgroundColor: '#22c55e',
            borderRadius: '9999px',
            marginLeft: '20px'
          }} 
        />
      </div>
      
      <header className="header">
        <div className="header-buttons">
          <button
            className="create-user-button create-button"
            onClick={() => setShowNewCampaignModal(true)}
          >
            Create New Campaign
          </button>
          <button
            className="create-user-button create-button"
            onClick={() => setShowFollowUpModal(true)}
          >
            Create New Follow Up Campaign
          </button>
        </div>
      </header>

      <div className="campaign-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="search-filter">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search for a Campaign" 
              className="search-input3" 
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-button">
              {/* <Search size={16} /> */}
            </button>
          </div>
          <button 
            className={`filter-button ${showFollowUpsOnly ? 'active' : ''}`}
            onClick={() => setShowFollowUpsOnly(!showFollowUpsOnly)}
          >
            Show only Follow Ups
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading">Loading campaigns...</div>
          ) : (
            <table className="campaigns-table">
            <thead>
              <tr>
                <th className="campaign-name" style={{ textAlign: 'center' }}>Campaign Name</th>
                <th style={{ textAlign: 'center' }}>Market</th>
                <th style={{ textAlign: 'center' }}>Contact List</th>
                <th style={{ textAlign: 'center' }}>Sent</th>
                <th style={{ textAlign: 'center' }}>Remaining</th>
                <th style={{ textAlign: 'center' }}>Hot</th>
                <th style={{ textAlign: 'center' }}>Drip</th>
                <th style={{ textAlign: 'center' }}>Deliverability</th>
                <th style={{ textAlign: 'center' }}>Response</th>
                <th style={{ textAlign: 'center' }}>Created</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCampaigns.length > 0 ? (
                displayedCampaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td style={{ textAlign: 'center' }}>{campaign.name}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.market}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.contactListId || '-'}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.sent}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.remaining}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.hot}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.drip}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.deliverability}</td>
                    <td style={{ textAlign: 'center' }}>{campaign.response}</td>
                    <td style={{ textAlign: 'center' }}>{formatDate(campaign.created)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="actions-cell">
                        <button 
                          className="icon-button" 
                          title="View campaign"
                          onClick={() => openViewModal(campaign)}
                        >
                          <span className="view-icon">👁️</span>
                        </button>
                        <button 
                          className="icon-button"
                          title="Edit campaign"
                          onClick={() => openEditModal(campaign)}
                        >
                          <span className="edit-icon">✏️</span>
                        </button>
                        <button
                          className="icon-button"
                          title="Delete campaign"
                          onClick={() => openDeleteModal(campaign)}
                        >
                          <span className="delete-icon">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-data">
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>

        <div className="pagination-container">
          <div className="total-entries">Total: {filteredCampaigns.length}</div>
          <div className="pagination-controls">
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="pagination-button active">{currentPage}</button>
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
          <div className="entries-selector">
            <span>Entries</span>
            <div className="dropdown">
              <select 
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setTotalPages(Math.ceil(filteredCampaigns.length / Number(e.target.value)));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateCampaignModal
          isOpen={showNewCampaignModal}
          onClose={() => setShowNewCampaignModal(false)}
          onSave={handleSaveNewCampaign}
        />
        <CreateFollowUpModal
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          onSave={handleSaveFollowUp}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          campaignName={selectedCampaign?.name || ''}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedCampaign(null);
          }}
          onConfirm={handleDeleteCampaign}
        />
        
        {/* View Campaign Modal */}
        <ViewCampaignModal
          isOpen={showViewModal}
          campaign={selectedCampaign}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCampaign(null);
          }}
        />
        
        {/* Edit Campaign Modal */}
        <EditCampaignModal
          isOpen={showEditModal}
          campaign={selectedCampaign}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCampaign(null);
          }}
          onSave={handleUpdateCampaign}
        />
      </div>
    </>
  );
};

export default CampaignManagement;