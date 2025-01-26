import React, { useState } from "react";
import "./DeleteCategory.css";
import useCategories from "../../assets/useCategories"; // Import the existing hook

function DeleteCategory({toggleDeleteCategoryModal}) {
  const categories = useCategories(); // Use the hook to fetch categories
  const [message, setMessage] = useState(""); // Feedback message

  const handleDelete = async (categoryId,categoryName) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage(`Category "${categoryName}" deleted successfully!`);

        // Remove the deleted category from the local list
        const updatedCategories = categories.filter(
          (category) => category._id !== categoryId
        );
        setMessage("Category deleted successfully!");
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
                onClick={() => handleDelete(category._id, category.title)}
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
