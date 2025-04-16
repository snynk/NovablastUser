import React, { useState, useEffect } from "react";
import UserAvatar from "@/components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "@/components/Component";
import { LinkList, LinkItem } from "@/components/links/Links";
import { useTheme, useThemeUpdate } from "@/layout/provider/Theme";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const User = () => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ Local user state
  const toggle = () => setOpen((prevState) => !prevState);
  const navigate = useNavigate();

  // ✅ Load user info from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  // ✅ Logout function
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth-login", { replace: true });
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => ev.preventDefault()}
      >
          <div className="user-toggle flex items-center gap-1">
          <UserAvatar icon="user-alt" className="sm" />
          <ChevronDown style={{ width: '24px', height: '24px', color: '#4B5563' }} />
          {/* <div className="user-info d-none d-md-block">
            <div className="user-status">Welcome<span className="wave" role="img" aria-label="wave">👋</span> </div>
            <div className="user-name dropdown-indicator" style={{ marginRight: "3.25rem" }}>
              {user?.name || "User"}
            </div>
          </div> */}
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{user?.name}</span>
              <span className="sub-text">{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
            <LinkItem link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Account Setting
            </LinkItem>
            <LinkItem link="/user-profile-activity" icon="activity-alt" onClick={toggle}>
              Login Activity
            </LinkItem>
            {/* <li>
              <a
                className={`dark-switch ${theme.skin === 'dark' ? 'active' : ''}`}
                href="#"
                onClick={(ev) => {
                  ev.preventDefault();
                  themeUpdate.skin(theme.skin === 'dark' ? 'light' : 'dark');
                }}
              >
                {theme.skin === 'dark' ? (
                  <>
                    <em className="icon ni ni-sun"></em>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <em className="icon ni ni-moon"></em>
                    <span>Dark Mode</span>
                  </>
                )}
              </a>
            </li> */}
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem icon="signout" onClick={handleLogout}>
              Sign Out
            </LinkItem>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
