import React, { useEffect, useState } from "react";
import axios from "axios";

const MarketsTabContent = ({ onOpenMarketModal, onOpenDlcForm }) => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/markets/getmarket");
      console.log("API Response:", data);
      setMarkets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  return (
    <div className="tab-content">
      <div className="filters-row">
        <button className="create-button" onClick={onOpenDlcForm}>10 DLC Form</button>
        <button className="create-button" onClick={onOpenMarketModal}>+ Request New Market</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Market Name</th>
              <th>Call Forwarding Number</th>
              <th>Area Code</th>
              <th>Time Zone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(markets) && markets.length > 0 ? (
    markets.map((market) => (
      <tr key={market._id}>
        <td>{market.name}</td>
        <td>{market.callForwardingNumber}</td>
        <td>{market.areaCode}</td>
        <td>{market.timeZone}</td>
        <td>{market.status}</td>
        <td>
          <button>Edit</button>
          <button>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr><td colSpan="6">No markets found</td></tr>
  )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketsTabContent;
