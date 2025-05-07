import React, { useState } from "react";
import FormInput from "Components/SignUpComponents/FormInput";
import FileInput from "Components/SignUpComponents/FileInput";
import useCategories from "Components/assets/useCategories";
import "./AddMovie.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function AddMovie({ closePanel }) {
  const categories = useCategories();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseYear: "",
    duration: "",
    categories: [],
    movieFile: null,
    movieImage: null,
    cast: "",
    director: "",
  });

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const updatedCategories = checked
        ? [...prevFormData.categories, value]
        : prevFormData.categories.filter((cat) => cat !== value);
      return { ...prevFormData, categories: updatedCategories };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "releaseYear" || name === "duration" ? Number(value) : value,
    });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData({ ...formData, movieFile: files[0] });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    setFormData({ ...formData, movieImage: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("releaseYear", Number(formData.releaseYear));
    formDataObj.append("duration", Number(formData.duration));
    formDataObj.append("cast", formData.cast);
    formDataObj.append("director", formData.director);

    formData.categories.forEach((category) => {
      formDataObj.append("categories[]", category);
    });

    if (formData.movieFile) {
      formDataObj.append("movieFile", formData.movieFile);
    }
    if (formData.movieImage) {
      formDataObj.append("movieImage", formData.movieImage);
    }

    try {
      const token = await localStorage.getItem("jwtToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/movies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Movie Successfully Added!");
        closePanel();
      } else {
        alert("Error adding movie: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  return (
    <div className="add-movie-container">
      <div className="add-movie">
        <div className="side-panel">
          <h2>Add New Movie</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Movie Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <FormInput
                label="Description"
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <FormInput
                label="Release Year"
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
              />
              <FormInput
                label="Duration (minutes)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
              <FileInput
                label="Movie File (MP4)"
                name="movieFile"
                onChange={handleFileChange}
                accept="video/mp4"
              />
              <FileInput
                label="Movie Image (JPG, PNG, JPEG)"
                name="movieImage"
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
              />
              <FormInput
                label="Cast"
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
              />
              <FormInput
                label="Director"
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Categories</label>
              <div>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category._id}
                        checked={formData.categories.includes(category._id)}
                        onChange={handleCategoryChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${category.id}`}
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No categories available.</p>
                )}
              </div>
            </div>
            <div className="panel-actions-container">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closePanel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Movie
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMovie;
