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
    movieImage: null,
    cast: "",
    director: "",
  });

  // Fetch movie details by ID when the component mounts
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/movies/${movieId}`
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
            movieImage: null, // Don't preload the image
            cast: movie.cast,
            director: movie.director,
          });
          console.log("Movie Details:", movie);
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
      movieFile: files[0],
    });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      movieImage: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("releaseYear", formData.releaseYear);
    data.append("duration", formData.duration);
    data.append("cast", formData.cast);
    data.append("director", formData.director);

    // Convert categories array into a JSON string
    if (formData.categories.length > 0) {
      data.append("categories", JSON.stringify(formData.categories));
    }

    // Append files ONLY if they exist
    if (formData.movieFile) {
      data.append("movieFile", formData.movieFile);
    }
    if (formData.movieImage) {
      data.append("movieImage", formData.movieImage);
    }

    // Debugging: Log FormData content
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/movies/${movieId}`,
        {
          method: "PUT",
          body: data, // ✅ Send FormData
        }
      );

      if (response.ok) {
        alert("Movie Successfully Updated!");
        toggleEditMovieModal(); // Close modal
      } else {
        const resData = await response.json();
        alert("Error updating movie: " + (resData.error || "Unknown error"));
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
