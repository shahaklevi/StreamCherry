import React, { useState, useEffect } from "react";
import FormInput from "Components/SignUpComponents/FormInput";
import FileInput from "Components/SignUpComponents/FileInput";
import useCategories from "Components/assets/useCategories";
import "./EditMoviePage.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function EditMoviePage({ closePanel }) {
  // States for search and editing
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data state for editing a movie
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

  const categories = useCategories();

  // Handle movie search
  const handleSearch = async (e) => {
    setIsEditing(false);
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setMovies([]);
      return;
    }

    try {
      const token = await localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/movies/search/${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies || []);
      } else {
        console.error("Error fetching movies:", response.statusText);
      }
    } catch (error) {
      console.error("Server error:", error.message);
    }
  };

  // When a movie is selected from the search results,
  // store its id, set editing mode, and clear the search list.
  const handleSelectMovie = (movieId) => {
    setSelectedMovieId(movieId);
    setIsEditing(true);
    setMovies([]); // Close the search list
  };

  // Fetch movie details whenever selectedMovieId changes
  useEffect(() => {
    if (selectedMovieId) {
      const fetchMovieDetails = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("No token available, skipping request.");
          return;
        }
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/movies/${selectedMovieId}`,
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
              movieFile: null, // Files are not preloaded
              movieImage: null,
              cast: movie.cast,
              director: movie.director,
            });
          } else {
            alert("Error fetching movie details: " + (movie.error || "Unknown error"));
          }
        } catch (error) {
          alert("Server Error: " + error.message);
        }
      };
      fetchMovieDetails();
    }
  }, [selectedMovieId]);

  // Form change handlers
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "releaseYear" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({ ...prev, movieFile: files[0] }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({ ...prev, movieImage: files[0] }));
  };

  // Submit the form to update the movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("releaseYear", formData.releaseYear);
    data.append("duration", formData.duration);
    data.append("cast", formData.cast);
    data.append("director", formData.director);
    formData.categories.forEach((category) =>
      data.append("categories[]", category)
    );
    if (formData.movieFile) data.append("movieFile", formData.movieFile);
    if (formData.movieImage) data.append("movieImage", formData.movieImage);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/movies/${selectedMovieId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      if (response.ok) {
        alert("Movie Successfully Updated!");
        closePanel();
      } else {
        const resData = await response.json();
        alert("Error updating movie: " + (resData.error || "Unknown error"));
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  const handleCancel = () => {
    closePanel();
  };

  return (
    <div className="edit-movie-page">
      <div className="edit-container">
        <h2>Edit Movie</h2>
        {/* Search box at the top of the form */}
        <div className="search-box">
          <label htmlFor="movieSearch">Search Movies:</label>
          <input
            type="text"
            id="movieSearch"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Enter movie title"
          />
        </div>

        {/* Show search results below search box */}
        {!isEditing && movies.length > 0 && (
          <ul className="movies-list">
            {movies.map((movie) => (
              <li key={movie._id} className="movie-item">
                <span>{movie.title}</span>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSelectMovie(movie._id)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* The full edit form is always visible */}
        <form onSubmit={handleSubmit} className="form-grid">
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
          <div className="categories-block">
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
                      checked={formData.categories.includes(category._id)}
                      onChange={handleCategoryChange}
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
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMoviePage;
