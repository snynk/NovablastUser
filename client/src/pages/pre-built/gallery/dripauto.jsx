import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit
} from 'lucide-react';
import Dripautomodal from "./dripautomodal";
import "@/assets/css/dripauto.css";

export default function DripAutomation() {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: "Follow up text after 10 days",
      day: 65,
      message: "Hey/Hi/Hello",
      moreCount: 1
    },
    {
      id: 2,
      name: "Follow Up",
      day: 1,
      message: "Hello/Hey/Hi?",
      moreCount: 6
    }
  ]);

  const [entriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditUser = (automation) => {
    console.log("Edit automation:", automation);
  };

  const handleDeleteUser = (id) => {
    console.log("Delete automation with ID:", id);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="batches-header px-7 pt-8" style={{ color: '#0f172a', marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h1 
    className="dashboard-title" 
    style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0 0 20px' }}
  >
    Drip Automation
  </h1>
  <div 
    style={{ 
      height: '4px', 
      width: '60%',  // Adjust to span the full width of the container or as required
      backgroundColor: '#22c55e', // Green color
      marginTop: '1px',
      marginLeft:'20px' ,
    }} 
  />
</div>
        <button
          className="create-user-button bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md mt-4"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Drip Automation
        </button>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <Search className="text-gray-400" size={18} /> */}
              </div>
              <input
                type="text"
                placeholder="Search"
                className="search-input1 pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="automation-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Messages</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {automations.map((automation) => (
                  <tr key={automation.id}>
                    <td>
                      <div className="name-container">
                        <span className="automation-name">{automation.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="message-container">
                        <div className="day-badge">Day {automation.day}</div>
                        <div className="message-content">
                          <p className="message-text">{automation.message}</p>
                          {automation.moreCount > 0 && (
                            <p className="more-count">+{automation.moreCount} more</p>
                          )}
                        </div>
                      </div>
                    </td>
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

          {/* Pagination */}
          <div className="pagination-container mt-6 flex items-center justify-between">
            <div className="total-entries">Total: {automations.length}</div>
            <div className="pagination-controls flex items-center gap-2">
              <button className="pagination-button"><ChevronsLeft size={16} /></button>
              <button className="pagination-button"><ChevronLeft size={16} /></button>
              <button className="pagination-button active">1</button>
              <button className="pagination-button"><ChevronRight size={16} /></button>
              <button className="pagination-button"><ChevronsRight size={16} /></button>
            </div>
            <div className="entries-selector flex items-center gap-2">
              <span>Entries</span>
              <div className="dropdown flex items-center gap-1">
                <span>{entriesPerPage}</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Dripautomodal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newAutomation) => {
          setAutomations([...automations, {
            id: Date.now(),
            name: newAutomation.name,
            day: newAutomation.messages[0].day,
            message: newAutomation.messages[0].content,
            moreCount: newAutomation.messages.length - 1
          }]);
        }}
      />
    </div>
  );
}