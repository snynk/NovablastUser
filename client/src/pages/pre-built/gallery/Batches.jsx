import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info, Check, MoreVertical, Search, Filter } from 'lucide-react';
import BatchBuilderModal from './BatchBuilderModal';
import "@/assets/css/batches.css";

const BatchesDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sorting functionality
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="batches-container">
      <div className="batches-header" style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 20px 0'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 
            className="dashboard-title" 
            style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0' }}
          >
            Batches
          </h1>
          <div 
            style={{ 
              height: '4px', 
              width: '60%',
              backgroundColor: '#22c55e',
              marginTop: '1px' 
            }} 
          />
        </div>
        <button className="create-button create-user-button" onClick={openModal}>
          Create New Batches
        </button>
      </div>

      <div className="batches-content">
        <div className="tab-header">
          <h2>Completed</h2>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search batches..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            <button className="filter-btn">
              <Filter size={16} />
              <span>Filters</span>
            </button>
            
            <select className="view-select">
              <option value="all">All Batches</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="batches-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <span>Batch Number</span>
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Campaign</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>User</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Messages Sent</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Deliverability</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Response</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Template</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Last Send</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Status</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>
                    <div className="batch-number">
                      <div></div>
                      <div></div>
                    </div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div></div>
                      </div>
                      <span></span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar response-bar">
                        <div></div>
                      </div>
                      <span></span>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="total-records">
            Total: <strong>0</strong> batches
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn"><ChevronsLeft size={16} /></button>
            <button className="pagination-btn"><ChevronLeft size={16} /></button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn"><ChevronRight size={16} /></button>
            <button className="pagination-btn"><ChevronsRight size={16} /></button>
          </div>
          <div className="entries-selector">
            <span>Entries</span>
            <select>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Builder Modal */}
      <BatchBuilderModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default BatchesDataTable;