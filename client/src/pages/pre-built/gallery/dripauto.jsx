import React, { useState, useEffect } from 'react';
import {
  ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Eye,
  Smile, AlertCircle, X
} from 'lucide-react';
import Dripautomodal from "./dripautomodal";
import DripDetailsModal from "./DripDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "@/assets/css/dripauto.css";
import { dripAutomationService } from '@/services/dripAutomationService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DripAutomation() {
  // State management
  const [automations, setAutomations] = useState([]);
  const [allAutomations, setAllAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [automationToDelete, setAutomationToDelete] = useState(null);

  // Fetch drip automations
  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const response = await dripAutomationService.getAllDripAutomations();
      if (response?.data) {
        setAutomations(response.data);
        setAllAutomations(response.data);
        setTotalPages(Math.ceil(response.data.length / entriesPerPage));
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching automations:', error);
      setError('Failed to fetch automations. Please try again.');
      toast.error('Failed to fetch automations. Please check your connection and try again.', {
        toastId: 'fetch-error' // Add a unique ID to prevent duplicate toasts
      });
    } finally {
      setLoading(false);
    }
  };

  // Search drip automations locally
  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setAutomations(allAutomations);
      setTotalPages(Math.ceil(allAutomations.length / entriesPerPage));
      setCurrentPage(1);
      return;
    }

    const filteredResults = allAutomations.filter(automation => 
      automation.name.toLowerCase().includes(query) || 
      (automation.messages?.some(msg => 
        msg.content.toLowerCase().includes(query) || 
        `day ${msg.day}`.includes(query)
      ))
    );
    
    setAutomations(filteredResults);
    setTotalPages(Math.ceil(filteredResults.length / entriesPerPage));
    setCurrentPage(1);
  };

  // Initialize and handle data updates
  useEffect(() => {
    fetchAutomations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(handleSearch, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, allAutomations]);

  useEffect(() => {
    setTotalPages(Math.ceil(automations.length / entriesPerPage));
  }, [automations, entriesPerPage]);

  // CRUD operations
  const handleCrudOperation = async (operation, data = null) => {
    try {
      setLoading(true);
      let message = '';
      let toastId = '';
      
      switch(operation) {
        case 'edit':
          setCurrentAutomation(data);
          setIsModalOpen(true);
          return;
          
        case 'view':
          setCurrentAutomation(data);
          setIsDetailsModalOpen(true);
          return;
          
        case 'delete-prompt':
          setAutomationToDelete(data);
          setIsDeleteModalOpen(true);
          return;
          
        case 'delete':
          await dripAutomationService.deleteDripAutomation(automationToDelete._id);
          message = `"${automationToDelete.name}" drip automation deleted successfully`;
          toastId = `delete-${automationToDelete._id}`;
          break;
          
        case 'update':
          await dripAutomationService.updateDripAutomation(currentAutomation._id, data);
          message = `"${data.name}" drip automation updated successfully`;
          toastId = `update-${currentAutomation._id}`;
          break;
          
        case 'create':
          await dripAutomationService.createDripAutomation(data);
          message = `"${data.name}" drip automation created successfully`;
          toastId = `create-${Date.now()}`;
          break;
      }
      
      toast.success(message, { toastId });
      await fetchAutomations();
      
      // Reset states
      setIsModalOpen(false);
      setIsDeleteModalOpen(false);
      setCurrentAutomation(null);
      setAutomationToDelete(null);
      
    } catch (error) {
      console.error(`Error during ${operation}:`, error);
      const errorMessage = error.response?.data?.message || `Failed to ${operation} automation`;
      toast.error(errorMessage, { 
        toastId: `error-${operation}-${Date.now()}` // Use a unique ID with timestamp
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle save automation (create or update)
  const handleSaveAutomation = (automationData) => {
    const operation = currentAutomation ? 'update' : 'create';
    handleCrudOperation(operation, automationData);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (automationToDelete) {
      handleCrudOperation('delete');
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesPerPageChange = (entries) => {
    setEntriesPerPage(entries);
    setCurrentPage(1);
    setTotalPages(Math.ceil(automations.length / entries));
  };

  // Format automation data for display
  const formatAutomationForDisplay = (automation) => {
    if (!automation.messages?.length) {
      return {
        id: automation._id,
        name: automation.name,
        day: 'N/A',
        message: 'No messages configured',
        moreCount: 0
      };
    }

    return {
      id: automation._id,
      name: automation.name,
      day: automation.messages[0].day,
      message: automation.messages[0].content,
      moreCount: automation.messages.length > 1 ? automation.messages.length - 1 : 0
    };
  };

  // Calculate pagination indices
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentAutomations = automations.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="bg-gray-100 min-h-screen">
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
      
      {/* Header */}
      <div className="batches-header px-7 pt-8" style={{ color: '#0f172a', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="dashboard-title" style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0 0 20px' }}>
            Drip Automation
          </h1>
          <div style={{ height: '4px', width: '60%', backgroundColor: '#22c55e', marginTop: '10px', marginLeft:'20px' }} />
        </div>
        <button
          className="create-button create-user-button"
          onClick={() => {
            setCurrentAutomation(null);
            setIsModalOpen(true);
          }}
        >
          Create New Drip Automation
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or message content"
                className="search-input1 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <p className="mt-2">Loading automations...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">
                <p>{error}</p>
                <button className="mt-2 text-blue-500 underline" onClick={fetchAutomations}>
                  Try Again
                </button>
              </div>
            ) : automations.length === 0 ? (
              <div className="text-center py-4">
                {searchQuery ? 
                  <p>No automations found matching "{searchQuery}"</p> : 
                  <p>No automations found. Create your first drip automation!</p>
                }
              </div>
            ) : (
              <table className="automation-table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Messages</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAutomations.map((automation) => {
                    const displayData = formatAutomationForDisplay(automation);
                    return (
                      <tr key={displayData.id}>
                        <td>
                          <div className="name-container">
                            <span className="automation-name">{displayData.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="message-container">
                            <div className="day-badge">Day {displayData.day}</div>
                            <div className="message-content">
                              <p className="message-text">{displayData.message}</p>
                              {displayData.moreCount > 0 && (
                                <p className="more-count">+{displayData.moreCount} more</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions flex gap-2">
                            <div className="actions-cell">
                              <button 
                                className="icon-button" 
                                onClick={() => handleCrudOperation('view', automation)} 
                                title="View details"
                              >
                                <span className="view-icon">👁️</span>
                              </button>
                              <button 
                                className="icon-button"
                                onClick={() => handleCrudOperation('edit', automation)}
                                title="Edit automation"
                              >
                                <span className="edit-icon">✏️</span>
                              </button>
                              <button 
                                className="icon-button"
                                onClick={() => handleCrudOperation('delete-prompt', automation)}
                                title="Delete automation"
                              >
                                <span className="delete-icon">🗑️</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination-container mt-6 flex items-center justify-between">
            <div className="total-entries">
              {automations.length > 0 ? 
                `Showing ${indexOfFirstEntry + 1}-${Math.min(indexOfLastEntry, automations.length)} of ${automations.length} entries` : 
                'No entries'
              }
            </div>
            <div className="pagination-controls flex items-center gap-2">
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || automations.length === 0}
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || automations.length === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || automations.length === 0}
              >
                <ChevronRight size={16} />
              </button>
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || automations.length === 0}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
            <div className="entries-selector flex items-center gap-2">
              <span>Show</span>
              <div className="dropdown flex items-center gap-1">
                <select 
                  value={entriesPerPage}
                  onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dripautomodal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentAutomation(null);
        }}
        onSave={handleSaveAutomation}
        automationData={currentAutomation}
      />

      <DripDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setCurrentAutomation(null);
        }}
        automationData={currentAutomation}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAutomationToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={automationToDelete?.name || ''}
        itemType="drip automation"
      />
    </div>
  );
}