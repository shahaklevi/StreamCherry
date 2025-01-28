import React, { useState, useEffect } from "react";
import FormInput from "../SignUpComponents/FormInput";
import FileInput from "../SignUpComponents/FileInput";
import useCategories from "../../assets/useCategories";
import "./EditMovie.css";

function EditMovie({ toggleEditMovieModal, movieId }) {
  const categories = useCategories(); // Fetch categories using the custom hook

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseYear: "",
    duration: "",
    categories: [], // Selected categories
    movieFile: null,
    cast: "",
    director: "",
  });

  // Fetch movie details by ID when the component mounts
  useEffect(() => {
    const token =  localStorage.getItem("jwtToken"); // Retrieve token from context

      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/movies/${movieId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          }
        );
        const movie = await response.json();
        if (response.ok) {
          setFormData({
            title: movie.title,
            description: movie.description,
            releaseYear: movie.releaseYear,
            duration: movie.duration,
            categories: movie.categories || [],
            movieFile: null, // Don't preload the file
            cast: movie.cast,
            director: movie.director,
          });
        } else {
          alert(
            "Error fetching movie details: " + (movie.error || "Unknown error")
          );
        }
      } catch (error) {
        alert("Server Error: " + error.message);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Handle category checkbox changes
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevFormData) => {
      const updatedCategories = checked
        ? [...prevFormData.categories, value]
        : prevFormData.categories.filter((cat) => cat !== value);

      return {
        ...prevFormData,
        categories: updatedCategories,
      };
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
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // Store the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Movie metadata
    const movieJson = {
      title: formData.title,
      description: formData.description,
      releaseYear: formData.releaseYear,
      duration: formData.duration,
      categories: formData.categories,
      cast: formData.cast,
      director: formData.director,
    };

    try {
      const token = await localStorage.getItem("jwtToken"); // Retrieve token from context

      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/api/movies/${movieId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieJson),
        }
      );

      // Handle response
      if (response.status === 204) {
        alert("Movie Successfully Updated!");
        toggleEditMovieModal(); // Close the modal
        return;
      }

      // Parse JSON for other status codes
      const data = await response.json();
      if (response.ok) {
        alert("Movie Successfully Updated!");
        toggleEditMovieModal(); // Close the modal
      } else {
        alert("Error updating movie: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  return (
    <div className="edit-movie">
      <div className="modal">
        <h2>Edit Movie</h2>
        <form onSubmit={handleSubmit}>
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
            label="Duration"
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
          <div>
            <label>Categories</label>
            <div>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <div key={category._id || index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`category-${category._id || index}`}
                      value={category._id}
                      checked={formData.categories.includes(category._id)} // Check if category exists
                      onChange={handleCategoryChange} // Call change handler
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`category-${category._id || index}`}
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
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Update Movie
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleEditMovieModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMovie;
