import React, { useState, useEffect } from "react";
import "./DeleteCategory.css";
import useCategories from "../../assets/useCategories"; // Import the existing hook

function DeleteCategory({ toggleDeleteCategoryModal }) {
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
        `http://localhost:3000/api/categories/${categoryId}`,
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
    <div className="modal">
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
        onClick={toggleDeleteCategoryModal}
      >
        Close
      </button>
    </div>
  );
}

export default DeleteCategory;
