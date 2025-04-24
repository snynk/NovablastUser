import React from "react";
import "@/assets/css/PageLoader.css";

const PageLoader = () => {
  return (
    <div className="loader-container">
      <div className="spinner large">
        {/* 12 dots to create the circular spinner */}
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        <div className="spinner-dots"></div>
        {/* <div className="spinner-text">Loading...</div> */}
      </div>
    </div>
  );
};

export default PageLoader;