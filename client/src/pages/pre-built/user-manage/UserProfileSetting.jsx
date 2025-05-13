import React, { useState, useEffect } from "react";
import Content from "@/layout/content/Content";
import { Card, Badge, Modal, Button, Input } from "reactstrap";
import Head from "@/layout/head/Head";
import axios from "axios";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
} from "@/components/Component";
import UserProfileAside from "./UserProfileAside";

const UserProfileSettingPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [message, setMessage] = useState("");
    // ✅ Retrieve the logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInCustomerId = user && user.id ? user.id : null;

   const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
     customerId: loggedInCustomerId, // ✅ Attach customer ID
  });

  useEffect(() => {
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
  }, []);

  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  // useEffect(() => {
  //   fetchUserData(); // ✅ Fetch user details on page load
  // }, []);

  // const fetchUserData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/api/users/me", {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     });
  //     setUserData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };
  const handleChange = (name, value) => {
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  const handleSubmit = async () => {
  try {
    // ✅ Append customerId to the URL instead of formData
    const response = await axios.put(`http://localhost:3000/api/customers/${formData.customerId}/change-password`, {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    setMessage(response.data.message);
    setIsModalOpen(false); // ✅ Close modal after success
  } catch (error) {
    setMessage(error.response.data.error);
  }
};


  return (
    <React.Fragment>
      <Head title="User Profile - Security"></Head>
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
                    <BlockTitle tag="h4">Security Settings</BlockTitle>
                    <BlockDes>
                      <p>These settings help keep your account secure.</p>
                    </BlockDes>
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
                <Card className="card-bordered">
                  <div className="card-inner-group">
                    <div className="card-inner">
                      <div className="between-center flex-wrap flex-md-nowrap g-3">
                        <div className="nk-block-text">
                          <h6>Save my Activity Logs</h6>
                          <p>You can save all activity logs including unusual activity detected.</p>
                        </div>
                        <div className="nk-block-actions">
                          <ul className="align-center gx-3">
                            <li className="order-md-last">
                              <div className="custom-control custom-switch me-n2">
                                <InputSwitch checked id="activity-log" />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Change Password</h6>
                          <p>Set a unique password to protect your account.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button color="primary" onClick={() => setIsModalOpen(true)}>Change Password</Button>
                            </li>
                            <li>
                              <em className="text-soft text-date fs-12px">
                                Last changed: <span>{userData?.lastPasswordChange || "Unknown"}</span>
                              </em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Block>
            </div>
          </div>
        </Card>
      </Content>

      {/* Change Password Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change Password">
        <div className="modal-body">
          <div className="form-group">
            <label>Current Password</label>
            <Input type="password" value={formData.oldPassword} onChange={(e) => handleChange("oldPassword", e.target.value)} />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <Input type="password" value={formData.newPassword} onChange={(e) => handleChange("newPassword", e.target.value)} />
          </div>

          {message && <p className="error-message">{message}</p>}
        </div>

        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>Update Password</Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default UserProfileSettingPage;
