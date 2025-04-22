import React, { useState, useEffect } from 'react';
import "@/assets/css/useracount.css";
import { Search, ChevronDown, MoreVertical, Smile, Code, Trash2, Check, X, Edit } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    aliasName: '',
    companyName: '',
    phoneNumber: '',
    timezone: '',
    role: '',
    active: true,
    avatar: null, // Add avatar field
  });

  // Simulate fetching users data
  useEffect(() => {
    // Mock data
    const mockUsers = [
      {
        id: 'JS',
        fullName: 'Jonathan Sandoval',
        status: 'Active',
        role: 'Agent',
        joinedDate: '4/10/2025',
        avatar: null, // Example avatar
      }
    ];

    setUsers(mockUsers);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRole('');
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value, // Handle file input
    });
  };

  const handleSaveUser = () => {
    // Create new user logic
    const newUserData = {
      id: `${newUser.firstName.charAt(0)}${newUser.lastName.charAt(0)}`,
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      status: newUser.active ? 'Active' : 'Inactive',
      role: newUser.role,
      joinedDate: new Date().toLocaleDateString(),
      avatar: newUser.avatar, // Save avatar
    };

    setUsers([...users, newUserData]);
    setShowCreateModal(false);

    // Reset form
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      aliasName: '',
      companyName: '',
      phoneNumber: '',
      timezone: '',
      role: '',
      active: true,
      avatar: null,
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ')[1],
      role: user.role,
      active: user.status === 'Active',
      avatar: user.avatar,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? {
          ...user,
          fullName: `${newUser.firstName} ${newUser.lastName}`,
          status: newUser.active ? 'Active' : 'Inactive',
          role: newUser.role,
          avatar: newUser.avatar,
        }
        : user
    );
    setUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  // Filter users based on search query and selected role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management-container" style={{ color: '#0f172a', margin: '80px 0 20px 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0 20px 0' }}>User Accounts</h1>
      <div className="user-management-header">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a user"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="role-select"
            >
              <option value="">Roles</option>
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
            <button onClick={handleReset} className="reset-button">Reset</button>
          </div>
        </div>
        <div className="batches-header" >
          <button onClick={handleCreateUser} className="create-user-button">Create User</button>
        </div>
      </div>

      <div className="user-table-container" style={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "auto",
            }}>        
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="user-row">
                <td className="user-name">
                  <span className="user-initials">{user.id}</span>
                  <span>{user.fullName}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.joinedDate}</td>
                <td>
        <div className="table-actions">
          <button className="edit-button action-btn" onClick={() => handleEditUser(user)} aria-label="Edit">
            <Edit size={18} />
          </button>
          <button className="delete-button action-btn" onClick={() => handleDeleteUser(user.id)} aria-label="Delete">
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

      {showCreateModal && (
        <div className="modal-overlay1">
          <div className="create-user-modal">
            <div className="modal-header">
              <h2>Create New User</h2>
              <button onClick={handleCloseModal} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="avatar-section">
                <div className="avatar-container">
                  {newUser.avatar ? (
                    <img src={URL.createObjectURL(newUser.avatar)} alt="User Avatar" className="avatar-preview" />
                  ) : (
                    <div className="avatar-placeholder">N/A</div>
                  )}
                  <div className="upload-controls">
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleInputChange}
                      style={{ display: 'none' }} // Hide the input
                    />
                    <label htmlFor="avatar" className="upload-avatar-button">
                      Upload Avatar
                    </label>
                    <div className="allowed-file-types">Allowed file types: png, jpg, jpeg.</div>
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group1">
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter name"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@domain.com"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="aliasName">
                    Alias/Rep Name <span className="required">*</span>
                    <span className="info-icon">ⓘ</span>
                  </label>
                  <input
                    type="text"
                    id="aliasName"
                    name="aliasName"
                    placeholder="Alias/Rep Name"
                    value={newUser.aliasName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="companyName">
                    Company Name <span className="required">*</span>
                    <span className="info-icon">ⓘ</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                    value={newUser.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+1"
                    value={newUser.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="timezone">Timezone <span className="required">*</span></label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={newUser.timezone}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>

                <div className="form-group1">
                  <label htmlFor="role">Role <span className="required">*</span></label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="form-group1 checkbox-group">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newUser.active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="active">
                    Active <span className="info-icon">ⓘ</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
              <button onClick={handleSaveUser} className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay1">
          <div className="create-user-modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={handleCloseModal} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="avatar-section">
                <div className="avatar-container">
                  {newUser.avatar ? (
                    <img src={URL.createObjectURL(newUser.avatar)} alt="User Avatar" className="avatar-preview" />
                  ) : (
                    <div className="avatar-placeholder">N/A</div>
                  )}
                  <div className="upload-controls">
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleInputChange}
                      style={{ display: 'none' }} // Hide the input
                    />
                    <label htmlFor="avatar" className="upload-avatar-button">
                      Upload Avatar
                    </label>
                    <div className="allowed-file-types">Allowed file types: png, jpg, jpeg.</div>
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group1">
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter name"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="role">Role <span className="required">*</span></label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="form-group1 checkbox-group">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newUser.active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="active">
                    Active <span className="info-icon">ⓘ</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
              <button onClick={handleUpdateUser} className="save-button">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;