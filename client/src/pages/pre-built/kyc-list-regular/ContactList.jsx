import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, MoreVertical, Smile, Code, Trash2, Check, X, Edit } from 'lucide-react';

// import { Search, Trash2, Eye } from "lucide-react";
import "@/assets/css/contactlist.css";

const ContactList = () => {
    const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch grouped contacts dynamically from the new API route
  useEffect(() => {
    fetch("http://localhost:3000/api/groupedContacts")
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Error fetching grouped contacts:", err));
  }, []);

  const handleDelete = (sampleName) => {
    fetch(`http://localhost:3000/api/groupedContacts/${sampleName}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setContacts(contacts.filter((contact) => contact.sampleName !== sampleName));
      })
      .catch((err) => console.error("Error deleting contact list:", err));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };

  return (
    <div className="campaign-container">
      <h1 className="dashboard-title">Contact List</h1>
      <header className="header">
  <div className="header-buttons">
    <button 
      className="create-button create-user-button"
      onClick={() => navigate("/kyc-list-regular")}
    >
      Import Contacts
    </button>
  </div>
</header>
      {/* Search Input */}
      <div className="search-filter">
        <div className="search-wrapper">
          
          <input
            type="text"
            placeholder="Search Contacts List"
            className="search-input3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <Search className="search-icon" size={20} /> */}
        </div>
        
      </div>

      {/* Contacts Table */}
      <div className="table-container"  style={{
    maxHeight: "500px",
    overflowY: "auto",
    overflowX: "auto",
    border: "1px solid #ccc",
  }}>
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>List Name</th>
              <th>Total Rows</th>
              <th>Mobile</th>
              <th>Landlines</th>
              <th>VOIP</th>
              <th>DNC</th>
              <th>Duplicates</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((group) =>
                group.sampleName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((group, index) => (
                <tr key={index}>
                  <td>{group.sampleName}</td>
                  <td>{group.totalRows}</td>
                  <td>{group.mobilesType || "-"}</td>
                  <td>{group.landlinesType || "-"}</td>
                  <td>{group.voip || "-"}</td>
                  <td>{group.dnc || "-"}</td>
                  <td>{group.duplicates}</td>
                  <td>{formatDate(group.created)}</td>
                  <td>
                                      <div className="table-actions flex gap-2">
                                        <button
                                          className="edit-button action-btn"
                                          onClick={() => handleEditUser(automation)}
                                          aria-label="Edit"
                                        >
                                          <Edit size={18} />
                                        </button>
                                        <button
                                          className="delete-button action-btn"
                                          onClick={() => handleDeleteUser(automation.id)}
                                          aria-label="Delete"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                        <button className="action-btn more-options-button" aria-label="More options">
                                          <MoreVertical size={18} />
                                        </button>
                                      </div>
                                    </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
