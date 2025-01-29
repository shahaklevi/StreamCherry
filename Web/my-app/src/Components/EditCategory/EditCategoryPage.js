import React, { useState } from "react";
import "./EditCategory.css"; // יצירת קובץ CSS ייעודי
import useCategories from "../../assets/useCategories"; // שימוש ב-hook הקיים
import EditCategory from "./EditCategory"; // רכיב לעריכת קטגוריה

function EditCategoryPage({ toggleEditCategoryModal }) {
  const categories = useCategories(); // שימוש ב-hook להורדת קטגוריות
  const [selectedCategory, setSelectedCategory] = useState(null); // הקטגוריה שנבחרה לעריכה
  const [isEditing, setIsEditing] = useState(false); // האם במצב עריכה או לא

  // פתיחת חלון עריכה
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  // סגירת חלון עריכה
  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedCategory(null);
  };

  return (
    <div className="modal">
      <h2>Edit Category</h2>
      {categories.length > 0 ? (
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
      ) : (
        <p>No categories available.</p>
      )}
      {isEditing && selectedCategory && (
        <EditCategory
          category={selectedCategory}
          onClose={handleCloseEdit}
        />
      )}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={toggleEditCategoryModal}
      >
        Close
      </button>
    </div>
  );
}

export default EditCategoryPage;
