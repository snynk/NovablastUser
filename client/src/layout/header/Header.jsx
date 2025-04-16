import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import WelcomeHand from "./dropdown/WelcomeHand/WelcomeHand"; // ✅ corrected name
import Notification from "./dropdown/notification/Notification";

import { useTheme, useThemeUpdate } from "../provider/Theme";
import Dialer from "./dropdown/call/Dailer";

const Header = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  
  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });

  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate.sidebarVisibility}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>

          <div className="nk-header-tools d-flex justify-content-between align-items-center w-100">
            {/* Left Side */}
              <div className="d-none d-md-block">
                <WelcomeHand />
              </div>

            {/* Right Side */}
            <ul className="nk-quick-nav d-flex align-items-center mb-0">
                <li className="notification-dropdown me-n1">
                  <Notification />
                </li>
                <li className="dialer-dropdown">
                  <Dialer />
                </li>
                <li className="user-dropdown">
                  <User />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
