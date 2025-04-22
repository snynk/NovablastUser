import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info, Check, MoreVertical, Search, Filter } from 'lucide-react';
import "@/assets/css/batches.css";

const BatchesDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Static data - 4 rows as requested
  const batches = [
    {
      batchNumber: '52-8385',
      date: '04-16-23 14:57',
      campaign: 'AL Statewide abatee non LLC owned 5+ years 4/11/23',
      user: 'Jacob Scott',
      messages: '150 sent 0 in queue',
      deliverability: '96.00%',
      response: '21.53%',
      template: '4th sms',
      lastSend: 'April 16, 2023',
      status: 'success'
    },
    {
      batchNumber: '51-8385',
      date: '04-16-23 08:19',
      campaign: 'AL Statewide abatee non LLC owned 5+ years 4/11/23',
      user: 'Jacob Scott',
      messages: '150 sent 0 in queue',
      deliverability: '96.00%',
      response: '25.69%',
      template: '2nd sms template',
      lastSend: 'April 16, 2023',
      status: 'success'
    },
    {
      batchNumber: '50-8385',
      date: '04-16-23 08:16',
      campaign: 'AL Statewide abatee non LLC owned 5+ years 4/11/23',
      user: 'Jacob Scott',
      messages: '150 sent 0 in queue',
      deliverability: '92.67%',
      response: '25.18%',
      template: '2nd sms template',
      lastSend: 'April 16, 2023',
      status: 'success'
    },
    {
      batchNumber: '49-8385',
      date: '04-16-23 08:15',
      campaign: 'AL Statewide abatee non LLC owned 5+ years 4/11/23',
      user: 'Jacob Scott',
      messages: '150 sent 0 in queue',
      deliverability: '94.67%',
      response: '20.42%',
      template: '2nd sms template',
      lastSend: 'April 16, 2023',
      status: 'success'
    }
  ];

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

  // Apply sorting and filtering
  const filteredBatches = batches.filter(batch => {
    return Object.values(batch).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedBatches = [...filteredBatches].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="batches-container">
      <div className="batches-header" style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '80px 0 20px 0'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0 20px 0'}}>Batches</h1>
        <button className="create-batch-btn">Create New Batches</button>
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
                <th onClick={() => handleSort('batchNumber')}>
                  <div className="th-content">
                    <span>Batch Number</span>
                    <div className={`sort-indicator ${sortField === 'batchNumber' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th onClick={() => handleSort('campaign')}>
                  <div className="th-content">
                    <span>Campaign</span>
                    <Info className="info-icon" size={16} />
                    <div className={`sort-indicator ${sortField === 'campaign' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th onClick={() => handleSort('user')}>
                  <div className="th-content">
                    <span>User</span>
                    <Info className="info-icon" size={16} />
                    <div className={`sort-indicator ${sortField === 'user' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Messages Sent</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th onClick={() => handleSort('deliverability')}>
                  <div className="th-content">
                    <span>Deliverability</span>
                    <Info className="info-icon" size={16} />
                    <div className={`sort-indicator ${sortField === 'deliverability' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th onClick={() => handleSort('response')}>
                  <div className="th-content">
                    <span>Response</span>
                    <Info className="info-icon" size={16} />
                    <div className={`sort-indicator ${sortField === 'response' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <span>Template</span>
                    <Info className="info-icon" size={16} />
                  </div>
                </th>
                <th onClick={() => handleSort('lastSend')}>
                  <div className="th-content">
                    <span>Last Send</span>
                    <Info className="info-icon" size={16} />
                    <div className={`sort-indicator ${sortField === 'lastSend' ? 'active-' + sortDirection : ''}`}>
                      <span className="up-arrow">▲</span>
                      <span className="down-arrow">▼</span>
                    </div>
                  </div>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedBatches.map((batch, index) => (
                <tr key={index} className="data-row">
                  <td>
                    <div className="batch-number">
                      <div>{batch.batchNumber}</div>
                      <div className="batch-date">{batch.date}</div>
                    </div>
                  </td>
                  <td>
                    <div className="campaign-cell">{batch.campaign}</div>
                  </td>
                  <td>{batch.user}</td>
                  <td>{batch.messages}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: batch.deliverability }}></div>
                      </div>
                      <span>{batch.deliverability}</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar response-bar">
                        <div className="progress-fill" style={{ width: batch.response }}></div>
                      </div>
                      <span>{batch.response}</span>
                    </div>
                  </td>
                  <td>{batch.template}</td>
                  <td>{batch.lastSend}</td>
                  <td>
                    <div className="status-cell">
                      <div className={`status-icon ${batch.status}`}>
                        <Check size={16} color="white" />
                      </div>
                      <div className="action-dropdown">
                        <button className="action-btn">
                          <MoreVertical size={16} />
                        </button>
                        <div className="dropdown-menu">
                          <a href="#">View Details</a>
                          <a href="#">Export Data</a>
                          <a href="#">Clone Batch</a>
                          <a href="#">Delete</a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="total-records">
            Total: <strong>4</strong> batches
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
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchesDataTable;