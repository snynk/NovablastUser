import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Icon, UserAvatar } from "@/components/Component";
import { findUpper } from "@/utils/Utils";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";

const UserProfileAside = ({ updateSm, sm }) => {
  const [profileData, setProfileData] = useState({
    name: "Loading...",
    email: "Loading...",
  });

  useEffect(() => {
    sm ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");

    // ✅ Fetch User Data Dynamically
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user?.id) {
      fetch(`http://localhost:3000/api/customers/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileData({
            name: data.name || "Unknown User",
            email: data.email || "Not Available",
          });
        })
        .catch((error) => console.error("Failed to fetch profile data", error));
    }
  }, [sm]);

  return (
    <div className="card-inner-group">
      <div className="card-inner">
        <div className="user-card">
          <UserAvatar text={findUpper(profileData.name)} theme="primary" />
          <div className="user-info">
            <span className="lead-text">{profileData.name}</span>
            <span className="sub-text">{profileData.email}</span>
          </div>
          <div className="user-action">
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="btn btn-icon btn-trigger me-n2">
                <Icon name="more-v"></Icon>
              </DropdownToggle>
              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => ev.preventDefault()}
                    >
                      <Icon name="camera-fill"></Icon>
                      <span>Change Photo</span>
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => ev.preventDefault()}
                    >
                      <Icon name="edit-fill"></Icon>
                      <span>Update Profile</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>

      <div className="card-inner p-0">
        <ul className="link-list-menu">
          <li onClick={() => updateSm(false)}>
            <NavLink to={`/user-profile-regular`}>
              <Icon name="user-fill-c"></Icon>
              <span>Personal Information</span>
            </NavLink>
          </li>
          <li onClick={() => updateSm(false)}>
            <NavLink to={`/user-profile-activity`}>
              <Icon name="activity-round-fill"></Icon>
              <span>Account Activity</span>
            </NavLink>
          </li>
          <li onClick={() => updateSm(false)}>
            <NavLink to={`/user-profile-setting`}>
              <Icon name="lock-alt-fill"></Icon>
              <span>Security Setting</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfileAside;
