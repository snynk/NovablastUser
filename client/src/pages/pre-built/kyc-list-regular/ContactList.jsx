import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import "@/assets/css/contactlist.css";

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/groupedContacts")
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Error fetching grouped contacts:", err));
  }, []);

  const handleDelete = (sampleName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${sampleName}"?`)
     if (!isConfirmed) return; // Stop execution if user cancels
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
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <>
      {/* 👇 Moved outside the main container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h1 
    className="dashboard-title" 
    style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '100px 20px 10px' }}
  >
    Contact List
  </h1>
  <div 
    style={{ 
      height: '4px', 
      width: '100px', 
      backgroundColor: '#22c55e', // Tailwind's green-500
      borderRadius: '9999px', 
      marginLeft: '20px' 
    }} 
  />
</div>
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

      <div className="contact-list-container">
        <div className="search-filter">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search Contacts List"
              className="search-input3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{
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
                  <div className="actions-cell">
                    <button 
                          className="icon-button" 
                          title="View contact"
                          onClick={() => navigate(`/View-contacts/${group.sampleName}`)} // ✅ Correct Placement
                        >
                          <span className="view-icon">👁️</span>
                        </button>
                    {/* <button className="icon-button">
                      <span className="edit-icon">✏️</span>
                    </button> */}
                   <button
                          className="icon-button"
                          title="Delete Contactlist"
                          onClick={() => handleDelete(group.sampleName)}
                        >
                          <span className="delete-icon">🗑️</span>
                        </button>
                  </div>
                </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContactList;
