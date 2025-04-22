import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // Capture the selected Sample Name
import { Search, Trash2, Edit } from "lucide-react";
import AddModal from "./AddModal"; // ✅ Import Add Modal
import EditModal from "./EditModal"; // ✅ Import Edit Modal
import "@/assets/css/campaings.css";

const ContactList = () => {
     const navigate = useNavigate();
  const { sampleName } = useParams(); // Get Sample Name from URL
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null); // For editing
  const [modal, setModal] = useState({ add: false, edit: false });
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    City: "",
    State: "",
    Zip: "",
    PropertyAddress: "",
    PropertyCity: "",
    PropertyState: "",
    PropertyZip: "",
    Phone1: "",
    Phone2: "",
    Phone3: "",
  });
  

  
  useEffect(() => {
    fetch(`http://localhost:3000/api/contacts/${sampleName}`) // Fetch contacts for this sample
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Error fetching contacts:", err));
  }, [sampleName]); // Re-fetch when Sample Name changes

  // ✅ Handle deleting a contact
  const handleDelete = (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return; // Stop if the user cancels
    }
    fetch(`http://localhost:3000/api/contacts/${contactId}`, {
      method: "DELETE",
    })
      .then(() => setContacts(contacts.filter(contact => contact._id !== contactId)))
      .catch((err) => console.error("Error deleting contact:", err));
  };

  // ✅ Handle adding a new contact
  const handleAdd = (formData) => {
    fetch("http://localhost:3000/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, SampleName: sampleName }),
    })
      .then((res) => res.json())
      .then((contact) => {
        setContacts([...contacts, contact]);
        setModal({ add: false }); // Close modal
      })
      .catch((err) => console.error("Error adding contact:", err));
  };

// ✅ Handle updating an existing contact
const handleUpdate = (formData) => {
  fetch(`http://localhost:3000/api/contacts/${selectedContact._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((updatedContact) => {
      setContacts(contacts.map(contact => contact._id === updatedContact._id ? updatedContact : contact));
      setModal({ edit: false }); // Close modal
      setSelectedContact(null);
    })
    .catch((err) => console.error("Error updating contact:", err));
};


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
    <button className="create-button" onClick={() => setModal({ add: true })}>Add Contact</button> {/* ✅ Open Add Modal */}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) =>
                Object.values(contact).some((value) =>
                  value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .map((contact) => (
                <tr key={contact._id}>
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
                  <td>
                  <button onClick={() => { setSelectedContact(contact); setModal({ edit: true }); }}>
                    <Edit size={18} />
                  </button> {/* ✅ Open Edit Modal with pre-filled data */}
                  <button onClick={() => handleDelete(contact._id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
                </tr>
              ))}
          </tbody>
        </table>
          {/* ✅ Add Contact Modal */}
      <AddModal
        modal={modal.add}
        closeModal={() => setModal({ add: false })}
        onSubmit={handleAdd}
        formData={{ FirstName: "", LastName: "", Phone1: "" }}
        setFormData={() => {}} // Not needed for Add Modal
      />

      {/* ✅ Edit Contact Modal */}
      {selectedContact && (
        <EditModal
          modal={modal.edit}
          closeModal={() => setModal({ edit: false })}
          onSubmit={handleUpdate}
          formData={selectedContact} // ✅ Pre-fill data for editing
          setFormData={setSelectedContact}
        />
      )}
  
      </div>
    </div>
  );
};

export default ContactList;
