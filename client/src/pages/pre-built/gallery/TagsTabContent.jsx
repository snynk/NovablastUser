import React, { useEffect, useState } from "react";
import axios from "axios";

const TagsTabContent = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data } = await axios.get("/api/tags/all");
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  return (
    <div className="tab-content">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Prospects</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td>
                  <span className="tag-badge" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                </td>
                <td>{tag.prospects}</td>
                <td>{tag.created}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-tag-button">+ Add New Tag</button>
    </div>
  );
};

export default TagsTabContent;
