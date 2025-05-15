import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info, Search, Filter } from 'lucide-react';
import BatchBuilderModal from './BatchBuilderModal';
import "@/assets/css/batches.css";

const BatchesDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div className="batches-container">
      {/* Header */}
      <div className="batches-header" style={{margin: '80px 0 20px 0'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="dashboard-title" style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0' }}>
            Batches
          </h1>
          <div style={{ height: '4px', width: '60%', backgroundColor: '#22c55e', marginTop: '1px' }} />
        </div>
        <button className="create-button create-user-button" onClick={() => setIsModalOpen(true)}>
          Create New Batches
        </button>
      </div>

      {/* Content */}
      <div className="batches-content">
        <div className="tab-header">
          <h2>Completed</h2>
        </div>

        {/* Search and Filter */}
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

        {/* Table */}
        <div className="table-container">
          <table className="batches-table">
            <thead>
              <tr>
                {['Batch Number', 'Campaign', 'User', 'Messages Sent', 'Deliverability', 
                  'Response', 'Template', 'Last Send', 'Status'].map(header => (
                  <th key={header}>
                    <div className="th-content">
                      <span>{header}</span>
                      {header !== 'Batch Number' && <Info className="info-icon" size={16} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="batch-number"><div></div><div></div></div></td>
                <td><div></div></td>
                <td></td>
                <td></td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar"><div></div></div>
                    <span></span>
                  </div>
                </td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar response-bar"><div></div></div>
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

        {/* Pagination */}
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
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
              {[10, 25, 50, 100].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BatchBuilderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BatchesDataTable;