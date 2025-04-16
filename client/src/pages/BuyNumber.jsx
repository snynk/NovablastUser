import React, { useState, useEffect, useRef } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import { Card, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockBetween,
  BlockTitle,
  Icon,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "@/components/Component";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSortAmountUp, FaSortAmountDown, FaChevronRight, FaSearch, FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const BuyNumber = () => {
  const [sm, updateSm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignNumbers, setAssignNumbers] = useState([]);
  const [originalNumbers, setOriginalNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [onSearchText, setSearchText] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("id");
  const [formData, setFormData] = useState({
    areaCode: "",
    numberType: "Local",
    selectedUserId: 1,
    phoneNumber: ""
  });
  const [editFormData, setEditFormData] = useState({
    id: null,
    user_id: "",
    mobileno: "",
    number_type: ""
  });
  const [totalCount, setTotalCount] = useState(0);

  // Fetch data from API
  const fetchAssignNumbers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/assignnumbers');
      const data = response.data.data;
      setAssignNumbers(data);
      setOriginalNumbers(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch data. Please try again.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignNumbers();
  }, []);

  // Handle search functionality
  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (searchText !== "") {
      const filteredData = originalNumbers.filter((item) => {
        return (
          (item.mobileno && item.mobileno.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.number_type && item.number_type.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.id && item.id.toString().includes(searchText))
        );
      });
      setAssignNumbers(filteredData);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      setAssignNumbers([...originalNumbers]);
    }
  };

  // Handle sorting functionality
  const handleSort = (column) => {
    // If same column, toggle direction, otherwise set to asc
    const newDirection = column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortColumn(column);

    // Sort data based on column and direction
    const sortedData = [...assignNumbers].sort((a, b) => {
      if (column === "id" || column === "user_id") {
        return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
      } else if (column === "created_at") {
        return newDirection === "asc" 
          ? new Date(a[column]) - new Date(b[column]) 
          : new Date(b[column]) - new Date(a[column]);
      } else {
        // For text columns
        const aValue = a[column] ? a[column].toString().toLowerCase() : "";
        const bValue = b[column] ? b[column].toString().toLowerCase() : "";
        return newDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
    });

    setAssignNumbers(sortedData);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle radio button change
  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      numberType: e.target.value
    });
  };

  // Handle edit form radio button change
  const handleEditRadioChange = (e) => {
    setEditFormData({
      ...editFormData,
      number_type: e.target.value
    });
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    setFormData({
      ...formData,
      selectedUserId: parseInt(e.target.value)
    });
  };

  // Handle edit form user selection change
  const handleEditUserChange = (e) => {
    setEditFormData({
      ...editFormData,
      user_id: parseInt(e.target.value)
    });
  };

  // Get phone numbers for selected user
  const getPhoneNumber = () => {
    // In a real app, you would make an API call here
    const mockPhoneNumbers = {
      1: "+19876543210",
      2: "+18765432109"
    };
    
    return mockPhoneNumbers[formData.selectedUserId] || "";
  };

  // Submit form to buy number
  const handleBuyNumber = async () => {
    // Form validation
    if (!formData.areaCode) {
      Swal.fire({
        title: "Error!",
        text: "Please enter an area code",
        icon: "error"
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const newNumber = {
        user_id: formData.selectedUserId,
        mobileno: `+1${formData.areaCode}${Math.floor(1000000 + Math.random() * 9000000)}`,
        number_type: formData.numberType,
        created_at: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:3000/api/assignnumbers', newNumber);
      
      if (response.data.success) {
        // Close loading dialog
        Swal.close();
        
        // Show success message
        Swal.fire({
          title: "Success!",
          text: "Phone number purchased successfully!",
          icon: "success"
        });
        
        // Refresh the data without full page reload
        await fetchAssignNumbers();
        
        // Close modal
        toggleModal();
        
        // Reset form data
        setFormData({
          areaCode: "",
          numberType: "Local",
          selectedUserId: 1,
          phoneNumber: ""
        });
      }
    } catch (error) {
      console.error("Error buying number:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to purchase number. Please try again.",
        icon: "error"
      });
    }
  };

  // Function to open edit modal with pre-filled data
  const openEditModal = (id) => {
    const numberToEdit = assignNumbers.find(item => item.id === id);
    if (numberToEdit) {
      setEditFormData({
        id: numberToEdit.id,
        user_id: numberToEdit.user_id,
        mobileno: numberToEdit.mobileno,
        number_type: numberToEdit.number_type
      });
      setEditModalOpen(true);
    }
  };

  // Update phone number details
  const handleUpdateNumber = async () => {
    try {
      // Show loading state
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we update the number",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.put(`http://localhost:3000/api/assignnumbers/${editFormData.id}`, {
        user_id: editFormData.user_id,
        mobileno: editFormData.mobileno,
        number_type: editFormData.number_type
      });
      
      if (response.data.success) {
        // Close loading dialog
        Swal.close();
        
        // Show success message
        Swal.fire({
          title: "Updated!",
          text: "Phone number has been updated successfully!",
          icon: "success"
        });
        
        // Refresh the data
        await fetchAssignNumbers();
        
        // Close modal
        toggleEditModal();
      }
    } catch (error) {
      console.error("Error updating number:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update number. Please try again.",
        icon: "error"
      });
    }
  };

  // Handle delete with AJAX
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.delete(`http://localhost:3000/api/assignnumbers/${id}`);
          if (response.data.success) {
            return true;
          } else {
            throw new Error('Failed to delete record');
          }
        } catch (error) {
          console.error("Error deleting number:", error);
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Only reload the table data using AJAX, not the entire page
        await fetchAssignNumbers();
        
        Swal.fire({
          title: "Deleted!",
          text: "The number has been deleted successfully.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  // Function to toggle the buy number modal
  const toggleModal = () => setModalOpen(!modalOpen);

  // Function to toggle the edit number modal
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  // Handle rows per page change
  const handleItemPerPageChange = (value) => {
    setItemPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = assignNumbers.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // selects all the numbers
  const selectorCheck = (e) => {
    let newData;
    newData = assignNumbers.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setAssignNumbers([...newData]);
  };

  // selects one number
  const onSelectChange = (e, id) => {
    let newData = assignNumbers;
    let index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      newData[index].check = e.currentTarget.checked;
      setAssignNumbers([...newData]);
    }
  };

  // Bulk delete function
  const handleBulkDelete = () => {
    const selectedItems = assignNumbers.filter(item => item.check);
    if (selectedItems.length === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select at least one number to delete",
        icon: "warning"
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedItems.length} numbers!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          // In a real implementation, you would use a bulk delete API
          const deletePromises = selectedItems.map(item => 
            axios.delete(`http://localhost:3000/api/assignnumbers/${item.id}`)
          );
          
          await Promise.all(deletePromises);
          return true;
        } catch (error) {
          console.error("Error performing bulk delete:", error);
          Swal.showValidationMessage(`Bulk delete failed: ${error.message}`);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetchAssignNumbers();
        
        Swal.fire({
          title: "Deleted!",
          text: `${selectedItems.length} numbers have been deleted successfully.`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  // Sort indicator component
  const SortIndicator = ({ column }) => {
    if (sortColumn !== column) {
      return <span className="sort-icon opacity-50"><FaSortAmountUp size={12} /></span>;
    }
    return sortDirection === "asc" ? (
      <span className="sort-icon text-primary"><FaSortAmountUp size={12} /></span>
    ) : (
      <span className="sort-icon text-primary"><FaSortAmountDown size={12} /></span>
    );
  };

  return (
    <>
      <Head title="Buy Numbers" />
      <Content>
        <BlockHead size="lg">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h4" className="fw-bold">AssignNumber List</BlockTitle>
              <BlockDes className="text-soft mt-2">
                <p>Manage <code>AssignNumbers</code> here</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span> {itemPerPage}</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleItemPerPageChange(5);
                                }}
                              >
                                <span>5</span>
                                {itemPerPage === 5 && <Icon name="check" />}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleItemPerPageChange(10);
                                }}
                              >
                                <span>10</span>
                                {itemPerPage === 10 && <Icon name="check" />}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleItemPerPageChange(15);
                                }}
                              >
                                <span>15</span>
                                {itemPerPage === 15 && <Icon name="check" />}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleItemPerPageChange(20);
                                }}
                              >
                                <span>20</span>
                                {itemPerPage === 20 && <Icon name="check" />}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleItemPerPageChange(25);
                                }}
                              >
                                <span>25</span>
                                {itemPerPage === 25 && <Icon name="check" />}
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li>
                      <div className="form-control-wrap">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by ID, number or type"
                            value={onSearchText}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                          <div className="input-group-append" >
                            <Button color="primary" >
                              <FaSearch />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nk-block-tools-opt">
  <Button
    color="primary"
    className="btn-icon d-flex align-items-center justify-content-center"
    onClick={toggleModal}
    style={{ width: "150px", maxWidth: "100%" }}
  >
    <FaPlus className="me-1" />
    <span className="d-none d-md-inline-block">Buy Number</span>
  </Button>
</li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="mb-3">
            <Card className="card-bordered card-stretch">
              <div className="card-inner-group">
                <div className="card-inner position-relative">
                  <div className="card-title-group">
                    <div className="card-title">
                      {/* <h5 className="title">All Phone Numbers</h5> */}
                    </div>
                    <div className="card-tools">
                      <Button
                        color="danger"
                        size="sm"
                        outline
                        className="btn-dim"
                        onClick={handleBulkDelete}
                      >
                        <FaTrashAlt className="me-1" /> Delete Selected
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="card-inner p-0">
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading data...</p>
                    </div>
                  ) : (
                    <div className="nk-tb-list nk-tb-ulist">
                      <div className="nk-tb-item nk-tb-head bg-light">
                        <div className="nk-tb-col nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="uid_1"
                              onChange={(e) => selectorCheck(e)}
                            />
                            <label className="custom-control-label" htmlFor="uid_1"></label>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-sm cursor-pointer" onClick={() => handleSort("id")}>
                          <span className="sub-text fw-bold">ID {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md cursor-pointer" onClick={() => handleSort("user_id")}>
                          <span className="sub-text fw-bold">Username {sortColumn === "user_id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                        </div>
                        <div className="nk-tb-col cursor-pointer" onClick={() => handleSort("mobileno")}>
                          <span className="sub-text fw-bold">Number {sortColumn === "mobileno" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md cursor-pointer" onClick={() => handleSort("number_type")}>
                          <span className="sub-text fw-bold">Type {sortColumn === "number_type" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                        </div>
                       
                        <div className="nk-tb-col nk-tb-col-tools text-center">
                          <span className="sub-text fw-bold">Actions</span>
                        </div>
                      </div>
                      {/* Main data */}
                      {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                          <div className="nk-tb-item" key={item.id}>
                            <div className="nk-tb-col nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`uid${item.id}`}
                                  checked={item.check || false}
                                  onChange={(e) => onSelectChange(e, item.id)}
                                />
                                <label className="custom-control-label" htmlFor={`uid${item.id}`}></label>
                              </div>
                            </div>
                            <div className="nk-tb-col tb-col-sm">
                              <span>{item.id}</span>
                            </div>
                            <div className="nk-tb-col tb-col-md">
                              <span>User {item.user_id}</span>
                            </div>
                            <div className="nk-tb-col">
                              <span className="fw-medium">{item.mobileno}</span>
                            </div>
                            <div className="nk-tb-col tb-col-md">
                              <span className={`badge ${item.number_type === 'Local' ? 'bg-success' : 'bg-info'}`}>{item.number_type}</span>
                            </div>
                           
                            <div className="nk-tb-col nk-tb-col-tools text-center">
                            <ul className="nk-tb-actions gx-1 d-flex justify-content-center align-items-center">
                            <li>
                                  <Button size="sm" className="btn-icon btn-trigger" onClick={() => openEditModal(item.id)}>
                                    <FaEdit className="text-success" style={{ fontSize: "1.05rem" }} />
                                  </Button>
                                </li>
                                <li>
                                  <Button size="sm" className="btn-icon btn-trigger" onClick={() => handleDelete(item.id)}>
                                    <FaTrashAlt className="text-danger" style={{ fontSize: "1.05rem" }}/>
                                  </Button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nk-tb-item">
                          <div className="nk-tb-col" colSpan="7">
                            <div className="text-center p-3">
                              <span className="text-silent">No numbers found</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="card-inner">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, assignNumbers.length)} of {assignNumbers.length} entries
                    </div>
                    {assignNumbers.length > 0 && (
                      <PaginationComponent
                        itemPerPage={itemPerPage}
                        totalItems={assignNumbers.length}
                        paginate={paginate}
                        currentPage={currentPage}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Block>
      </Content>

      {/* Modal Popup for Buying Number */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal} className="bg-primary text-white">
          Purchase Number
        </ModalHeader>
        <ModalBody>
          <Row className="g-4">
            <Col md="6">
              <FormGroup>
                <Label for="areaCode" className="form-label">Area Code</Label>
                <div className="form-control-wrap">
                  <div className="input-group">
                    <input
                      type="text"
                      id="areaCode"
                      name="areaCode"
                      className="form-control"
                      placeholder="Enter area code"
                      onChange={handleInputChange}
                      value={formData.areaCode}
                    />
                    <div className="input-group-append">
                      <Button color="primary" onClick={getPhoneNumber}>
                              <FaSearch />
                            </Button>
                    </div>
                  </div>
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="userSelect" className="form-label">Select User</Label>
                <div className="form-control-wrap">
                  <Input
                    type="select"
                    id="userSelect"
                    name="selectedUserId"
                    className="form-select"
                    onChange={handleUserChange}
                    value={formData.selectedUserId}
                  >
                    <option value="1">User 1</option>
                    <option value="2">User 2</option>
                    <option value="3">User 3</option>
                    <option value="4">User 4</option>
                    <option value="5">User 5</option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label className="form-label">Number Type</Label>
                <div className="form-control-wrap">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          name="numberType"
                          id="localNumber"
                          value="Local"
                          checked={formData.numberType === "Local"}
                          onChange={handleRadioChange}
                        />
                        <Label className="custom-control-label" htmlFor="localNumber">
                          Local Number
                        </Label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          name="numberType"
                          id="tollFreeNumber"
                          value="Toll-Free"
                          checked={formData.numberType === "Toll-Free"}
                          onChange={handleRadioChange}
                        />
                        <Label className="custom-control-label" htmlFor="tollFreeNumber">
                          Toll-Free Number
                        </Label>
                      </div>
                    </li>
                  </ul>
                </div>
              </FormGroup>
            </Col>

            <Col md="12">
                      <FormGroup>
            <Label for="userSelect">Select User:</Label>
            <Input
              type="select"
              id="userSelect"
              name="selectedUserId"
              onChange={handleUserChange}
              value={formData.selectedUserId}
              className="form-select"
            >
              <option value="1">User 1</option>
              <option value="2">User 2</option>
              <option value="3">User 3</option>
              <option value="4">User 4</option>
              <option value="5">User 5</option>
            </Input>
          </FormGroup>
</Col>
<Col md="12">
          <FormGroup>
            <Label for="phoneNumber">Phone number</Label>
            <Input
              type="select"
              id="phoneNumber"
              disabled
              className="form-select bg-light"
            >
              <option value="">{getPhoneNumber() || "Select Phone Number"}</option>
            </Input>
          </FormGroup>
          </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleBuyNumber}>
            <FaPlus className="me-1" /> Purchase
          </Button>
          <Button color="secondary" onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>

{/* Edit Modal Popup */}
<Modal isOpen={editModalOpen} toggle={toggleEditModal} size="lg">
  <ModalHeader toggle={toggleEditModal} className="bg-primary text-white">
    Edit Phone Number
  </ModalHeader>
  <ModalBody>
    <Row className="g-4">
      <Col md="6">
        <FormGroup>
          <Label for="editMobileNo" className="form-label">Phone Number</Label>
          <div className="form-control-wrap">
            <Input
              type="text"
              id="editMobileNo"
              name="mobileno"
              className="form-control"
              placeholder="Enter phone number"
              onChange={handleEditInputChange}
              value={editFormData.mobileno}
            />
          </div>
        </FormGroup>
      </Col>
      <Col md="6">
        <FormGroup>
          <Label for="editUserSelect" className="form-label">Select User</Label>
          <div className="form-control-wrap">
            <Input
              type="select"
              id="editUserSelect"
              name="user_id"
              className="form-select"
              onChange={handleEditUserChange}
              value={editFormData.user_id}
            >
              <option value="1">User 1</option>
              <option value="2">User 2</option>
              <option value="3">User 3</option>
              <option value="4">User 4</option>
              <option value="5">User 5</option>
            </Input>
          </div>
        </FormGroup>
      </Col>
      <Col md="12">
        <FormGroup>
          <Label className="form-label">Number Type</Label>
          <div className="form-control-wrap">
            <ul className="custom-control-group g-3 align-center flex-wrap">
              <li>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="edit_number_type"
                    id="editLocalNumber"
                    value="Local"
                    checked={editFormData.number_type === "Local"}
                    onChange={handleEditRadioChange}
                  />
                  <Label className="custom-control-label" htmlFor="editLocalNumber">
                    Local Number
                  </Label>
                </div>
              </li>
              <li>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="edit_number_type"
                    id="editTollFreeNumber"
                    value="Toll-Free"
                    checked={editFormData.number_type === "Toll-Free"}
                    onChange={handleEditRadioChange}
                  />
                  <Label className="custom-control-label" htmlFor="editTollFreeNumber">
                    Toll-Free Number
                  </Label>
                </div>
              </li>
            </ul>
          </div>
        </FormGroup>
      </Col>
    </Row>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={handleUpdateNumber}>
      <FaEdit className="me-1" /> Update
    </Button>
    <Button color="secondary" onClick={toggleEditModal}>Close</Button>
  </ModalFooter>
</Modal>
    </>
  );
};

export default BuyNumber;