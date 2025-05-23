import React, { useState, useEffect } from "react";
import "./DeleteCategory.css";
import useCategories from "Components/assets/useCategories"; // Import the existing hook
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function DeleteCategory({ closePanel }) {
  const fetchedCategories = useCategories(); // Fetch categories using the hook
  const [categories, setCategories] = useState([]); // ✅ Start as an empty array
  const [message, setMessage] = useState(""); // Feedback message

  // ✅ Sync state when fetchedCategories changes
  useEffect(() => {
    setCategories(fetchedCategories);
  }, [fetchedCategories]); // Re-run when fetchedCategories updates

  console.log("Fetched Categories:", fetchedCategories.length);
  console.log("Categories in state:", categories.length);

  const handleDelete = async (categoryId, categoryName) => {
    try {
      const token = await localStorage.getItem("jwtToken"); // Retrieve token from context

      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Added Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMessage(`Category "${categoryName}" deleted successfully!`);

        // ✅ Correctly update the categories state after deletion
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId)
        );
      } else {
        const data = await response.json();
        setMessage(`Error deleting category: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed to delete category: ${error.message}`);
    }
  };

  return (
    <div className="side-panel">
      <div className="delete-category">
        <h2>Delete Category</h2>
        {categories.length > 0 ? (
          <ul className="categories-list">
            {categories.map((category) => (
              <li key={category._id} className="category-item">
                <span>{category.name}</span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(category._id, category.name)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories available.</p>
        )}
        {message && <p className="message">{message}</p>}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={closePanel}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DeleteCategory;
