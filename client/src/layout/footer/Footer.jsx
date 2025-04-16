import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkStyle = {
    color: "#7f8dff",
    textDecoration: "none",
    fontWeight: "bold",
  };
  return (
    <div className="nk-footer">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
        <div style={{ textAlign: "center", width: "100%" }}>
           &copy; {new Date().getFullYear()} <a href="https://xsquaretec.com/" style={linkStyle}>Xsquare Technology</a>. All Rights Reserved.
        </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
