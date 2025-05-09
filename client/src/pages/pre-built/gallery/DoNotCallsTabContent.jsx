import React, { useEffect, useState } from "react";
import axios from "axios";

const DoNotCallsTabContent = ({ dncEntries, fetchDncEntries, onOpenDncModal, onOpenEditDncModal }) => {
  const [filteredDncEntries, setFilteredDncEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

   // **Filter DNC entries whenever search query changes**
   useEffect(() => {
    let filtered = dncEntries;

    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.phoneNumber.includes(searchQuery) || 
        (entry.firstName && entry.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.lastName && entry.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredDncEntries(filtered);
    setCurrentPage(1);
  }, [searchQuery, dncEntries]);

  const handleExport = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/blocked/export");
  
      if (!response.ok) {
        throw new Error("Failed to fetch data for export");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "BlockedNumbers.xlsx"; // ✅ Set file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // **Handle deletion of DNC entry**
  const handleDeleteEntry = async (entryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/blocked/${entryId}`);
      fetchDncEntries(); // ✅ Refresh table instantly
    } catch (error) {
      console.error("Error deleting DNC entry:", error);
    }
  };

  const totalPages = Math.ceil(filteredDncEntries.length / entriesPerPage);
  const paginatedEntries = filteredDncEntries.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
     
  
  return (
    <div className="tab-content">
    <div className="filters-row">
      {/* Filters & Actions */}
      <div className="search-container">
        <input type="text" placeholder="Search for a user" className="search-input"  value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <button className="secondary-button" onClick={handleExport}>Export To Excel</button>
      <div className="spacer"></div>
      <button className="create-button create-user-button" onClick={onOpenDncModal}>
        <span className="plus">+</span> Create New DNC
      </button>
      <button className="create-button create-user-button">
        <span className="plus">+</span> Import New DNC
      </button>
    </div>
     {/* DNC Table */}
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable">Mobile number</th>
            <th className="sortable">First Name</th>
            <th className="sortable">Last Name</th>
            <th className="sortable">Permanent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {paginatedEntries.map((entry) => (
            <tr key={entry._id}>
              <td>
                <div className="phone-number">
                  <span className="flag-icon">🇺🇸</span> {entry.phoneNumber}
                </div>
              </td>
              <td>{entry.firstName}</td>
              <td>{entry.lastName}</td>
              <td>
                <span className="permanent-badge">{entry.permanent ? "Yes" : "No"}</span>
              </td>
              <td>
                <div className="actions-cell">
                  <button className="icon-button" onClick={() => onOpenEditDncModal(entry)}>
                    <span className="edit-icon">✏️</span>
                  </button>
                  <button className="icon-button" onClick={() => handleDeleteEntry(entry._id)}>
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
      {/* Pagination Controls */}

      <div className="pagination-container">
        <div className="pagination-info">Total: {filteredDncEntries.length}</div>
        <div className="pagination-controls">
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>‹</button>
          <span className="pagination-button active">{currentPage}</span>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>›</button>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
        </div>
        <div className="pagination-entries">
          Entries
          <select className="entries-select" onChange={(e) => setCurrentPage(Number(e.target.value))}>
            {[10, 20, 50].map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
      </div>
  </div>
);
};

export default DoNotCallsTabContent;
