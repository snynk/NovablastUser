import React from "react";
import LogoLight2x from "@/images/pnghut_facebook-messenger-android-application-package-mobile-app-instant-messaging-phones.png";
import LogoDark2x from "@/images/logo-dark2x.png";
import {Link} from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`/`} className="logo-link">
      <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />
      <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" />
    </Link>
  );
};

export default Logo;
