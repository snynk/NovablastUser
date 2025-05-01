import React, { useState, useEffect } from "react";
import Content from "@/layout/content/Content";
import { Card } from "reactstrap";
import Head from "@/layout/head/Head";
import { Modal, ModalBody } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "@/components/Component";
import { countryOptions } from "./UserData";
import UserProfileAside from "./UserProfileAside";

const UserProfileRegularPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [modalTab, setModalTab] = useState("1");
  const [customerData, setCustomerData] = useState({});
  const [formData, setFormData] = useState({});
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in user from localStorage
  const getLoggedInUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : {};
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return {};
    }
  };

  const loggedInCustomerId = getLoggedInUser().id || null;

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!loggedInCustomerId) {
        console.error("No logged-in customer ID found");
        setError("You must be logged in to view profile data");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/customers/${loggedInCustomerId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch customer data: ${response.status}`);
      }

      const customer = await response.json();
      setCustomerData(customer);
    } catch (error) {
      console.error("Error fetching customer data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();

    // Handle mobile view logic
    const viewChange = () => {
      if (window.innerWidth < 990) {
        setMobileView(true);
      } else {
        setMobileView(false);
        updateSm(false);
      }
    };

    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    
    const headerElement = document.getElementsByClassName("nk-header")[0];
    if (headerElement) {
      headerElement.addEventListener("click", function () {
        updateSm(false);
      });
    }
    
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
      if (headerElement) {
        headerElement.removeEventListener("click", function () {
          updateSm(false);
        });
      }
    };
  }, [loggedInCustomerId]);

  // Initialize form data when modal opens
  const openModal = () => {
    setFormData({
      name: customerData.name || "",
      phone: customerData.phone || "",
      address: customerData.address || "",
      address2: customerData.address2 || "",
      state: customerData.state || "",
      country: customerData.country || "",
    });
    setModal(true);
  };

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      if (!loggedInCustomerId) {
        alert("No customer ID found. Please log in again.");
        return;
      }

      // Validate required fields
      if (!formData.name) {
        alert("Name is required");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/customers/${loggedInCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
      }

      const updatedCustomer = await response.json();
      setCustomerData(updatedCustomer);
      alert("Profile updated successfully!");
      setModal(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert(`Failed to update profile: ${error.message}`);
    }
  };
  
  if (loading) {
    return (
      <React.Fragment>
        <Head title="User Profile"></Head>
        <Content>
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Content>
      </React.Fragment>
    );
  }

  if (error) {
    return (
      <React.Fragment>
        <Head title="User Profile"></Head>
        <Content>
          <div className="alert alert-danger" role="alert">
            {error}
            <div className="mt-3">
              <Button color="primary" onClick={fetchCustomerData}>
                Try Again
              </Button>
            </div>
          </div>
        </Content>
      </React.Fragment>
    );
  }
  
  return (
    <React.Fragment>
      <Head title="User Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Personal Information</BlockTitle>
                    <div className="nk-block-des">
                      <p>Your basic account information</p>
                    </div>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <div className="nk-data data-list">
                  <div className="data-item" onClick={openModal}>
                    <div className="data-col">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">{customerData.name || "Not set"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">{customerData.email || "Not set"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={openModal}>
                    <div className="data-col">
                      <span className="data-label">Phone Number</span>
                      <span className="data-value text-soft">{customerData.phone || "Not set"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={openModal}>
                    <div className="data-col">
                      <span className="data-label">Address</span>
                      <span className="data-value">
                        {customerData.address ? (
                          <>
                            {customerData.address}
                            {customerData.address2 && <br />}
                            {customerData.address2}
                            {(customerData.state || customerData.country) && <br />}
                            {customerData.state && `${customerData.state}, `}
                            {customerData.country || ""}
                          </>
                        ) : (
                          "Not set"
                        )}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                </div>
              </Block>

              <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
                <a
                  href="#close"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">Update Profile</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("1");
                          }}
                          href="#personal"
                        >
                          Personal
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "2" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("2");
                          }}
                          href="#address"
                        >
                          Address
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                Full Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="full-name"
                                className="form-control"
                                name="name"
                                onChange={onInputChange}
                                value={formData.name || ""}
                                placeholder="Enter Full name"
                                required
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="text"
                                id="phone-no"
                                className="form-control"
                                name="phone"
                                onChange={onInputChange}
                                value={formData.phone || ""}
                                placeholder="Phone Number"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    submitForm();
                                  }}
                                >
                                  Update Profile
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#cancel"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-l1">
                                Address Line 1
                              </label>
                              <input
                                type="text"
                                id="address-l1"
                                name="address"
                                onChange={onInputChange}
                                value={formData.address || ""}
                                className="form-control"
                                placeholder="e.g. 1234 Main St"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-l2">
                                Address Line 2
                              </label>
                              <input
                                type="text"
                                id="address-l2"
                                name="address2"
                                onChange={onInputChange}
                                value={formData.address2 || ""}
                                className="form-control"
                                placeholder="e.g. Apartment, suite, unit"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-st">
                                State
                              </label>
                              <input
                                type="text"
                                id="address-st"
                                name="state"
                                onChange={onInputChange}
                                value={formData.state || ""}
                                className="form-control"
                                placeholder="Enter your state"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Country
                              </label>
                              <RSelect
                                id="address-county"
                                options={countryOptions}
                                placeholder="Select a country"
                                value={
                                  formData.country
                                    ? {
                                        value: formData.country,
                                        label: formData.country,
                                      }
                                    : null
                                }
                                onChange={(selectedOption) => 
                                  setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" })
                                }
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button color="primary" size="lg" onClick={submitForm}>
                                  Update Address
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#cancel"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileRegularPage;