import React, { useEffect, useState } from "react";
import axios from "axios";

const MarketsTabContent = ({ onOpenMarketModal, onOpenDlcForm, onOpenEditMarketModal }) => {
  const [markets, setMarkets] = useState([]);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [marketFilter, setMarketFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/markets/getmarket");
      setMarkets(Array.isArray(data) ? data : []);
      setFilteredMarkets(Array.isArray(data) ? data : []); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  useEffect(() => {
    let filtered = markets;

    if (marketFilter) {
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(marketFilter.toLowerCase()));
    }
    if (areaFilter) {
      filtered = filtered.filter((m) => m.areaCode.includes(areaFilter));
    }

    setFilteredMarkets(filtered);
    setCurrentPage(1);
  }, [marketFilter, areaFilter, markets]);

  const handleDeleteMarket = async (marketId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this market?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/markets/${marketId}`);
      setMarkets((prevMarkets) => prevMarkets.filter((market) => market._id !== marketId));
      setFilteredMarkets((prevFilteredMarkets) => prevFilteredMarkets.filter((market) => market._id !== marketId));
    } catch (error) {
      console.error("Error deleting market:", error);
    }
  };

  const totalPages = Math.ceil(filteredMarkets.length / entriesPerPage);
  const paginatedMarkets = filteredMarkets.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  return (
    <div className="tab-content">
      <div className="filters-row">
        <div className="filter-dropdown">
          <select className="filter-select" value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)}>
            <option value="">All Markets</option>
            {markets.map((market) => (
              <option key={market.id} value={market.name}>{market.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-dropdown">
          <select className="filter-select" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="">All Area Codes</option>
            {markets.map((market) => (
              <option key={market.id} value={market.areaCode}>{market.areaCode}</option>
            ))}
          </select>
        </div>
        <div className="spacer"></div>
        <button className="create-button create-user-button" onClick={onOpenDlcForm}>10 DLC Form</button>
        <button className="create-button create-user-button" onClick={onOpenMarketModal}><span className="plus">+</span>Request New Market</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable">Market Name</th>
              <th className="sortable">Sent Today<div className="sent-today-label">0.00%</div></th>
              <th className="sortable">Sent This Month<div className="sent-month-label">36.83%</div></th>
              <th className="sortable">Call Forwarding Number</th>
              <th className="sortable">Registration Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMarkets.map((market) => (
              <tr key={market.id}>
                <td>
                  <div className="expandable-row">
                    <span className="expand-icon">▾</span>
                    {market.name}
                  </div>
                </td>
                <td>{market.sentToday}</td>
                <td>{market.sentThisMonth}</td>
                <td>{market.callForwardingNumber}</td>
                <td><span className="status-badge accepted">{market.status}</span></td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-button" onClick={() => onOpenEditMarketModal(market)}>✏️</button>
                    <button className="icon-button" onClick={() => handleDeleteMarket(market._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">Total: {filteredMarkets.length}</div>
        <div className="pagination-controls">
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
          <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>‹</button>
          <span className="pagination-button active">{currentPage}</span>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>›</button>
          <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
        </div>
        <div className="pagination-entries">
          Entries
          <select className="entries-select" onChange={(e) => setCurrentPage(Number(e.target.value))}>
            {[10, 20, 50].map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MarketsTabContent;
