import React, { useEffect, useState } from "react";
import axios from "axios";

const DoNotCallsTabContent = () => {
  const [dncEntries, setDncEntries] = useState([]);

  useEffect(() => {
    fetchDncEntries();
  }, []);

  const fetchDncEntries = async () => {
    try {
      const { data } = await axios.get("/api/dnc/all");
      setDncEntries(data);
    } catch (error) {
      console.error("Error fetching DNC entries:", error);
    }
  };

  return (
    <div className="tab-content">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mobile Number</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Permanent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dncEntries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.phone}</td>
                <td>{entry.firstName}</td>
                <td>{entry.lastName}</td>
                <td>{entry.permanent}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoNotCallsTabContent;
