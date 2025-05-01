import React, { useState, useEffect } from "react";
import Content from "@/layout/content/Content";
import { Card} from "reactstrap";
import Head from "@/layout/head/Head";
import DatePicker from "react-datepicker";
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
import { countryOptions, userData } from "./UserData";
import { getDateStructured } from "@/utils/Utils";
import UserProfileAside from "./UserProfileAside";

const UserProfileRegularPage = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve the logged-in user object
const loggedInCustomerId = user && user.id ? user.id : null; // Extract the customer ID

const [sm, updateSm] = useState(false);
const [mobileView, setMobileView] = useState(false);
const [modalTab, setModalTab] = useState("1");
const [customerData, setCustomerData] = useState(null); // Data fetched for logged-in customer
const [formData, setFormData] = useState({}); // Used for editing in the modal
const [modal, setModal] = useState(false);

const fetchCustomerData = async () => {
  try {
    if (!loggedInCustomerId) throw new Error("No logged-in customer ID found");

    const response = await fetch(`http://localhost:3000/api/customers/${loggedInCustomerId}`);
    if (!response.ok) throw new Error("Failed to fetch customer data");

    const customer = await response.json();
    setCustomerData(customer); // Update state with fetched data
  } catch (error) {
    console.error(error.message);
  }
};

useEffect(() => {
  fetchCustomerData(); // Fetch data on page load

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
  document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
    updateSm(false);
  });
  return () => {
    window.removeEventListener("resize", viewChange);
    window.removeEventListener("load", viewChange);
  };
}, [loggedInCustomerId]);

const onInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSaveUpdates = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/customers/${loggedInCustomerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to update customer data");

    const updatedCustomer = await response.json();
    alert("Customer data updated successfully!");
    setCustomerData(updatedCustomer); // Refresh state with latest data
    setModal(false); // Close modal
  } catch (error) {
    console.error(error.message);
  }
};
  
  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
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

                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">{customerData.name || "N/A"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  {/* <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Display Name</span>
                      <span className="data-value">{customerData.displayName}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div> */}
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">{customerData.email || "N/A"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Phone Number</span>
                      <span className="data-value text-soft">{customerData.phone || "N/A"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  {/* <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Date of Birth</span>
                      <span className="data-value">{customerData.dob || "N/A"}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div> */}
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Address</span>
                      <span className="data-value">
                        {customerData.address || "N/A"},
                        <br />
                        {customerData.state || "N/A"}, {customerData.country || "N/A"}
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
                    href="#dropdownitem"
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
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="full-name"
                                className="form-control"
                                name="name"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.name || customerData.name || ""}
                                placeholder="Enter Full name"
                              />
                            </div>
                          </Col>
                          {/* <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="display-name">
                                Display Name
                              </label>
                              <input
                                type="text"
                                id="display-name"
                                className="form-control"
                                name="displayName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.displayName}
                                placeholder="Enter display name"
                              />
                            </div>
                          </Col> */}
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="number"
                                id="phone-no"
                                className="form-control"
                                name="phone"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.phone|| customerData.phone || ""}
                                placeholder="Phone Number"
                              />
                            </div>
                          </Col>
                          {/* <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="birth-day">
                                Date of Birth
                              </label>
                              <DatePicker
                                selected={new Date(formData.dob)}
                                className="form-control"
                                onChange={(date) => setFormData({ ...formData, dob: getDateStructured(date) })}
                                maxDate={new Date()}
                              />
                            </div>
                          </Col> */}
                          {/* <Col size="12">
                            <div className="custom-control custom-switch">
                              <input type="checkbox" className="custom-control-input" id="latest-sale" />
                              <label className="custom-control-label" htmlFor="latest-sale">
                                Use full name to display{" "}
                              </label>
                            </div>
                          </Col> */}
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
                                  href="#dropdownitem"
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
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address}
                                className="form-control"
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
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address2}
                                className="form-control"
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
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.state}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Country
                              </label>
                              <RSelect
                                options={countryOptions}
                                placeholder="Select a country"
                                defaultValue={[
                                  {
                                    value: formData.country,
                                    label: formData.country,
                                  },
                                ]}
                                onChange={(e) => setFormData({ ...formData, country: e.value })}
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button color="primary" size="lg" onClick={() => submitForm()}>
                                  Update Address
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#dropdownitem"
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
