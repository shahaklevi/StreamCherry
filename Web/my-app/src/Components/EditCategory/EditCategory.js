import React, { useState } from "react";
import "./EditCategory.css";

function EditCategory({ category, onClose }) {
  const [formData, setFormData] = useState({
    name: category.name,
    promoted: category.promoted,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "promoted" ? value === "true" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await localStorage.getItem("jwtToken"); // Retrieve token from context

      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/api/categories/${category._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Category updated successfully!");

        onClose();
      } else {
        const data = await response.json();
        alert("Error updating category: " + data.error);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  return (
      <div className="edit-category">
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="input-group">
            <label htmlFor="name">Category Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="promoted">Promoted:</label>
            <select
              id="promoted"
              name="promoted"
              value={formData.promoted}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-save">
              Save
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
}

export default EditCategory;
