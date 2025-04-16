import React, { useState, useEffect, useMemo } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import { 
  Block, 
  BlockHead, 
  BlockTitle, 
  BlockBetween, 
  BlockHeadContent, 
  DataTableHead, 
  DataTableBody, 
  DataTableRow, 
  DataTableItem, 
  PaginationComponent,
  Icon
} from "@/components/Component";
import { 
  Card, 
  Button, 
  Input, 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem,
  Spinner,
  Badge
} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";

const ProductList = () => {
  // State management
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [formData, setFormData] = useState({
    user_id: "",
    mobileno: "",
    number_type: "",
    created_at: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Fetch data from API
  useEffect(() => {
    fetchAssignedNumbers();
  }, []);

  // Memoized filtered data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return numbers;
    
    return numbers.filter((item) => 
      item.mobileno.toLowerCase().includes(searchText.toLowerCase()) ||
      item.user_id.toString().includes(searchText) ||
      item.number_type.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [numbers, searchText]);

  // Memoized sorted data based on sort config
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Calculate pagination
  const pageCount = Math.ceil(sortedData.length / itemPerPage);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch numbers from API
  const fetchAssignedNumbers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/assignnumbers");
      const sortedData = res.data.data.sort((a, b) => a.id - b.id);
      setNumbers(sortedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load phone numbers",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemPerPage(newLimit);
    setCurrentPage(1);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new number
  const addNumber = async () => {
    try {
      if (!formData.mobileno || !formData.user_id) {
        return Swal.fire({
          icon: "warning",
          title: "Missing Information",
          text: "Please fill in all required fields",
        });
      }

      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/assignnumbers", formData);
      setNumbers((prev) => [...prev, res.data.data]);
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Number added successfully",
      });
    } catch (err) {
      console.error("Error adding number:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to add number",
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit a number
  const handleEdit = (id) => {
    const numberToEdit = numbers.find((num) => num.id === id);
    if (numberToEdit) {
      setFormData({
        user_id: numberToEdit.user_id,
        mobileno: numberToEdit.mobileno,
        number_type: numberToEdit.number_type,
        created_at: numberToEdit.created_at,
      });
      setEditId(id);
      setShowForm(true);
    }
  };

  // Update a number
  const updateNumber = async () => {
    try {
      if (!formData.mobileno || !formData.user_id) {
        return Swal.fire({
          icon: "warning",
          title: "Missing Information",
          text: "Please fill in all required fields",
        });
      }

      setLoading(true);
      const res = await axios.put(`http://localhost:3000/api/assignnumbers/${editId}`, formData);
      
      setNumbers((prev) =>
        prev.map((item) => (item.id === editId ? res.data.data : item))
      );
      
      resetForm();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Number updated successfully",
      });
    } catch (err) {
      console.error("Error updating number:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update number",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a number
  const deleteNumber = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete(`http://localhost:3000/api/assignnumbers/${id}`);
          setNumbers((prev) => prev.filter((item) => item.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Number has been deleted successfully.",
          });
        } catch (err) {
          console.error("Error deleting number:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete number",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      user_id: "",
      mobileno: "",
      number_type: "",
      created_at: ""
    });
    setEditId(null);
    setShowForm(false);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <Icon name="arrow-up" /> 
        : <Icon name="arrow-down" />;
    }
    return null;
  };

  // Get badge color based on number type
  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'mobile':
        return 'primary';
      case 'business':
        return 'success';
      case 'personal':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Head title="Phone Numbers Management" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3">Purchased Phone Numbers</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  color="primary"
                  className="toggle btn-icon d-md-none"
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-content">
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button 
                        color="primary" 
                        onClick={() => setShowForm(!showForm)}
                      >
                        <Icon name={showForm ? "minus" : "plus"} />
                        <span>{showForm ? "Hide Form" : "Add Number"}</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Form */}
        {showForm && (
          <Block>
            <Card>
              <div className="card-inner">
                <BlockTitle tag="h5">{editId ? "Edit Number" : "Add New Number"}</BlockTitle>
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="user_id">
                        User ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        className="form-control"
                        value={formData.user_id}
                        onChange={handleInputChange}
                        placeholder="Enter User ID"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="mobileno">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="mobileno"
                        name="mobileno"
                        className="form-control"
                        value={formData.mobileno}
                        onChange={handleInputChange}
                        placeholder="Enter Phone Number"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="number_type">
                        Number Type
                      </label>
                      <select
                        id="number_type"
                        name="number_type"
                        className="form-select"
                        value={formData.number_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Type</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Business">Business</option>
                        <option value="Personal">Personal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <Button 
                      color="primary" 
                      onClick={editId ? updateNumber : addNumber}
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? <Spinner size="sm" /> : null}
                      {editId ? "Update Number" : "Add Number"}
                    </Button>
                    <Button 
                      color="secondary" 
                      outline 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Block>
        )}

        <Block>
          <Card>
            <div className="card-inner">
              <div className="row mb-3">
                <div className="col-md-8">
                  <div className="form-group">
                    <div className="form-control-wrap">
                      <div className="form-icon form-icon-left">
                        <Icon name="search" />
                      </div>
                      <Input
                        type="text"
                        className="form-control"
                        id="searchText"
                        placeholder="Search by User ID, Phone or Type"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group d-flex justify-content-end">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret color="outline-secondary">
                        {itemPerPage} per page
                      </DropdownToggle>
                      <DropdownMenu>
                        {[5, 10, 20, 50].map((num) => (
                          <DropdownItem 
                            key={num} 
                            onClick={() => handleItemsPerPageChange(num)}
                            active={itemPerPage === num}
                          >
                            {num} per page
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th 
                          onClick={() => handleSort("id")}
                          className="cursor-pointer"
                        >
                          ID {getSortIcon("id")}
                        </th>
                        <th 
                          onClick={() => handleSort("user_id")}
                          className="cursor-pointer"
                        >
                          User {getSortIcon("user_id")}
                        </th>
                        <th 
                          onClick={() => handleSort("mobileno")}
                          className="cursor-pointer"
                        >
                          Phone Number {getSortIcon("mobileno")}
                        </th>
                        <th 
                          onClick={() => handleSort("number_type")}
                          className="cursor-pointer"
                        >
                          Type {getSortIcon("number_type")}
                        </th>
                        <th 
                          onClick={() => handleSort("created_at")}
                          className="cursor-pointer"
                        >
                          Created Date {getSortIcon("created_at")}
                        </th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>User {item.user_id}</td>
                            <td>{item.mobileno}</td>
                            <td>
                              <Badge color={getTypeColor(item.number_type)}>
                                {item.number_type || 'N/A'}
                              </Badge>
                            </td>
                            <td>{new Date(item.created_at).toLocaleDateString()}</td>
                            <td className="text-center">
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon me-1"
                                onClick={() => handleEdit(item.id)}
                              >
                                <Icon name="edit" />
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                className="btn-icon"
                                onClick={() => deleteNumber(item.id)}
                              >
                                <Icon name="trash" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && currentItems.length > 0 && (
                <div className="mt-4">
                  <PaginationComponent
                    itemPerPage={itemPerPage}
                    totalItems={sortedData.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </div>
          </Card>
        </Block>
      </Content>
    </>
  );
};

export default ProductList;