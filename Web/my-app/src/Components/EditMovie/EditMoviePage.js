import React, { useState } from "react";
import EditMovie from "./EditMovie"; // רכיב הטופס לעריכת הסרט
import "./EditMoviePage.css";

function EditMoviePage({ toggleEditMovieModal }) {
  const [movies, setMovies] = useState([]); // רשימת הסרטים המתאימים
  const [searchQuery, setSearchQuery] = useState(""); // ערך תיבת החיפוש
  const [selectedMovieId, setSelectedMovieId] = useState(null); // ID של הסרט שנבחר לעריכה
  const [isEditing, setIsEditing] = useState(false); // מצב עריכה

  // חיפוש סרטים לפי שם
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setMovies([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/movies/search/${query}`
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

  // פתיחת טופס עריכה עבור סרט שנבחר
  const handleEdit = (movieId) => {
    setSelectedMovieId(movieId);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    toggleEditMovieModal(); // להשתמש בפונקציה מהפרופס
  };

  return (
    <div className="edit-movie-page">
      <h2>Edit Movie</h2>
      {/* תיבת חיפוש */}
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
      <button className="close-btn" onClick={handleCloseEdit}>
        &#x2716;
      </button>

      {/* רשימת הסרטים המתאימים */}
      {!isEditing && (
        <ul className="movies-list">
          {movies.map((movie) => (
            <li key={movie._id} className="movie-item">
              <span>{movie.title}</span>
              <button
                className="btn btn-primary"
                onClick={() => handleEdit(movie._id)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* טופס עריכת הסרט */}
      {isEditing && selectedMovieId && (
        <div className="modal-overlay">
          <button className="close-btn" onClick={handleCloseEdit}>
            &#x2716;
          </button>
          <EditMovie
            toggleEditMovieModal={handleCloseEdit}
            movieId={selectedMovieId}
          />
        </div>
      )}
    </div>
  );
}

export default EditMoviePage;
