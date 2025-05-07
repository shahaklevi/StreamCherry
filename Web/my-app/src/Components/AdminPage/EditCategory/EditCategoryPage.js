import React, { useState } from "react";
import "./EditCategory.css";
import useCategories from "Components/assets/useCategories";
import EditCategory from "./EditCategory";
import "./EditCategoryPage.css";

function EditCategoryPage({ closePanel }) {
  const categories = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedCategory(null);
  };

  return (
    <div className="side-panel">
      <div className="edit-category-page">
        <h2>Edit Category</h2>
        {!isEditing && categories.length > 0 && (
          <ul className="categories-list">
            {categories.map((category) => (
              <li key={category._id} className="category-item">
                <span>{category.name}</span>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}

        {isEditing && selectedCategory && (
          <EditCategory category={selectedCategory} onClose={handleCloseEdit} />
        )}
        {!isEditing&& (
           <button
           type="button"
           className="btn btn-secondary"
           onClick={closePanel}
           >
           Close
           </button>
        )}

      </div>
    </div>
  );
}

export default EditCategoryPage;
