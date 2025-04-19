import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // Capture the selected Sample Name
import { Search } from "lucide-react";
import "@/assets/css/campaings.css";

const ContactList = () => {
     const navigate = useNavigate();
  const { sampleName } = useParams(); // Get Sample Name from URL
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/contacts/${sampleName}`) // Fetch contacts for this sample
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Error fetching contacts:", err));
  }, [sampleName]); // Re-fetch when Sample Name changes

  return (
    <div className="campaign-container">
      <h1 className="dashboard-title">Contacts for {sampleName}</h1>
      <header className="header">
  <div className="header-buttons">
    <button 
      className="create-button"
      onClick={() => navigate("/Contact-list")}
    >
      Contacts List
    </button>
  </div>
</header>

      {/* Search Input */}
      <div className="search-filter">
        <div className="search-wrapper">
          {/* <Search className="search-icon" size={20} /> */}
          <input
            type="text"
            placeholder="Search Contacts"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="table-container">
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Property Address</th>
              <th>Property City</th>
              <th>Property State</th>
              <th>Property Zip</th>
              <th>Phone1</th>
              <th>Phone2</th>
              <th>Phone3</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) =>
                Object.values(contact).some((value) =>
                  value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((contact, index) => (
                <tr key={index}>
                  <td>{contact.FirstName}</td>
                  <td>{contact.LastName}</td>
                  <td>{contact.City}</td>
                  <td>{contact.State}</td>
                  <td>{contact.Zip}</td>
                  <td>{contact.PropertyAddress}</td>
                  <td>{contact.PropertyCity}</td>
                  <td>{contact.PropertyState}</td>
                  <td>{contact.PropertyZip}</td>
                  <td>{contact.Phone1}</td>
                  <td>{contact.Phone2 || "-"}</td>
                  <td>{contact.Phone3 || "-"}</td>
                  <td>{contact.created.split("T")[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
