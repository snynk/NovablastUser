import React, { useState, useEffect } from 'react';
import "@/assets/css/useracount.css";
import { Search, ChevronDown, MoreVertical, Smile, Code, Trash2, Check, X, Edit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get stored user object
  const loggedInCustomerId = user && user.id ? user.id : null; // Use "id" instead of "_id"
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

  useEffect(() => {
    if (!loggedInCustomerId) {
      toast.error("Customer ID is missing!");
      return;
    }

    fetchUsers();
  }, [loggedInCustomerId]);

  // Function to fetch users
  const fetchUsers = () => {
    fetch(`http://localhost:3000/api/subusers/${loggedInCustomerId}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching subusers:", err));
  };

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
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      aliasName: "",
      companyName: "",
      phoneNumber: "",
      timezone: "",
      role: "",
      active: true,
      avatar: null, // Clear avatar when creating a new user
    });
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
  
  // Create a subuser associated with a customer
  const handleSaveUser = async () => {
    if (!loggedInCustomerId) {
      console.error("Error: loggedInCustomerId is undefined!");
      toast.error("Customer ID is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("customerId", loggedInCustomerId);
    formData.append("firstName", newUser.firstName);
    formData.append("lastName", newUser.lastName);
    formData.append("email", newUser.email);
    formData.append("aliasName", newUser.aliasName);
    formData.append("companyName", newUser.companyName);
    formData.append("phoneNumber", newUser.phoneNumber);
    formData.append("timezone", newUser.timezone);
    formData.append("role", newUser.role);
    formData.append("active", newUser.active);
    if (newUser.avatar) {
      formData.append("avatar", newUser.avatar);
    }

    console.log("Sending request with data:", Object.fromEntries(formData));

    try {
      const response = await fetch("http://localhost:3000/api/subusers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setShowCreateModal(false);
      toast.success("User created successfully!");
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user: " + error.message);
    }
  };

  // Edit user details
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      aliasName: user.aliasName || "",
      companyName: user.companyName || "",
      phoneNumber: user.phoneNumber || "",
      timezone: user.timezone || "",
      role: user.role,
      active: user.active,
      avatar: null, // Don't set the avatar to avoid file object issues
    });
    setShowEditModal(true);
  };

  // Update a subuser
  const handleUpdateUser = async () => {
    const formData = new FormData();

    formData.append("firstName", newUser.firstName);
    formData.append("lastName", newUser.lastName);
    formData.append("email", newUser.email);
    formData.append("role", newUser.role);
    formData.append("active", newUser.active);

    // Only append optional fields if they exist
    if (newUser.aliasName) formData.append("aliasName", newUser.aliasName);
    if (newUser.companyName) formData.append("companyName", newUser.companyName);
    if (newUser.phoneNumber) formData.append("phoneNumber", newUser.phoneNumber);
    if (newUser.timezone) formData.append("timezone", newUser.timezone);

    if (newUser.avatar && typeof newUser.avatar === "object") {
      formData.append("avatar", newUser.avatar); // Only append if it's a file
    }

    try {
      const response = await fetch(`http://localhost:3000/api/subusers/${selectedUser._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }
      
      const updatedSubUser = await response.json(); // Parse the updated user
      
      // Update the users state to reflect the changes
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedSubUser._id ? updatedSubUser : user
        )
      );

      toast.success("User updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user: " + error.message);
    }
  };

  // Delete a subuser
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/subusers/${userId}`, { 
        method: "DELETE" 
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
      } else {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to delete subuser:", error);
      toast.error("Failed to delete user: " + error.message);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesRole;
  }) : []; // Ensure users.filter always runs on an array

  return (
    <div className="user-management-container" style={{ color: '#0f172a', margin: '80px 0 20px 0' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 
          className="dashboard-title" 
          style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0' }}
        >
          User Accounts
        </h1>
        <div 
          style={{ 
            height: '4px', 
            width: '10%',  // Adjust to span the full width of the container or as required
            backgroundColor: '#22c55e', // Green color
            marginTop: '1px' 
          }} 
        />
      </div>
      
      <div className="user-management-header">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a user"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input2"
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
              <tr key={user._id} className="user-row">
                <td className="user-name">
                  {user.firstName} {user.lastName}
                </td>
                <td>
                  <span className={`status-badge ${user.active ? "active" : "inactive"}`}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="icon-button" 
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      <span className="edit-icon">✏️</span>
                    </button>
                    <button 
                      className="icon-button" 
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
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
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newUser.active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="active">
                    Active
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
                {newUser.avatar && typeof newUser.avatar === "object" ? (
                    <img src={URL.createObjectURL(newUser.avatar)} alt="User Avatar" className="avatar-preview" />
                  ) : selectedUser && selectedUser.avatar ? (
                    <img src={`http://localhost:3000${selectedUser.avatar}`} alt="User Avatar" className="avatar-preview" />
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
                    placeholder="Enter email"
                    value={newUser.email}
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
                    Active
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