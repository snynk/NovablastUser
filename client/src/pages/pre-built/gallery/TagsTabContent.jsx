import React, { useEffect, useState } from "react";
import axios from "axios";

const TagsTabContent = ({ tags, fetchTags, onOpenTagModal, onOpenEditTagModal }) => {
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

   // **Filter tags whenever search query changes**
   useEffect(() => {
    let filtered = tags;

    if (searchQuery) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTags(filtered);
    setCurrentPage(1);
  }, [searchQuery, tags]);

  // **Handle deletion of a tag**
  const handleDeleteTag = async (tagId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tag?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/tags/${tagId}`);
      fetchTags(); // ✅ Refresh list instantly
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const totalPages = Math.ceil(filteredTags.length / entriesPerPage);
  const paginatedTags = filteredTags.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  return (
    <div className="tab-content">
       {/* Filters & Actions */}
       <div className="filters-row">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for a tag" 
            className="search-input" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="spacer"></div>
        <button className="create-button create-user-button" onClick={onOpenTagModal}>
          <span className="plus-icon">+</span> Add New Tag
        </button>
      </div>
       {/* Tags Table */}
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable">Tag</th>
            <th className="sortable">Prospects</th>
            <th className="sortable">Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {paginatedTags.map((tag) => (
            <tr key={tag._id}>
              <td>
                <div className="tag-cell">
                  <span className="tag-badge" style={{ backgroundColor: tag.color }}>
                    {tag.name}
                  </span>
                </div>
              </td>
              <td>{tag.prospects}</td>
              <td>{new Date(tag.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="actions-cell">
                  <button className="icon-button" onClick={() => onOpenEditTagModal(tag)}>
                    <span className="edit-icon">✏️</span>
                  </button>
                  <button className="icon-button" onClick={() => handleDeleteTag(tag._id)}>
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
        <div className="pagination-info">Total: {filteredTags.length}</div>
        <div className="pagination-controls">
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>‹</button>
          <span className="pagination-button active">{currentPage}</span>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>›</button>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
        </div>
      </div>
  </div>
);
};


export default TagsTabContent;
