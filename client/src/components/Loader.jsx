import React from "react";

const Loader = () => {
  return (
    <div id="page-loader">
      <div className="spinner"></div>
      <style jsx="true">{`
        #page-loader {
          position: fixed;
          top: 0; 
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top-color: #333;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;