import React, { useState, useEffect } from "react";
import "./DeleteMovie.css";

function DeleteMovie({ toggleDeleteMovieModal }) {
  const [movieName, setMovieName] = useState(""); // User-entered movie name
  const [filteredMovies, setFilteredMovies] = useState([]); // Filtered movies based on query
  const [message, setMessage] = useState(""); // Message to the user
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה

  const handleSearch = async (e) => {
    const query = e.target.value;
    setMovieName(query);

    // Reset the message and set loading state
    setMessage("");
    setIsLoading(true);

    if (query.trim() === "") {
      setFilteredMovies([]);
      setIsLoading(false); // No search, so stop loading
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/movies/search/${query}`
      );
      if (response.ok) {
        const data = await response.json();
        const movies = data.movies || [];
        setFilteredMovies(movies);
      } else {
        setMessage(`Error fetching movies: ${response.statusText}`);
        setFilteredMovies([]);
      }
    } catch (error) {
      setMessage(`Failed to fetch movies: ${error.message}`);
      setFilteredMovies([]);
    } finally {
      setIsLoading(false); // Stop loading after fetching is complete
    }
  };

  const handleDelete = async (movieId,movieFile) => {
    try {
      // שלח בקשת DELETE לשרת
      const deleteResponse = await fetch(
        `http://localhost:3000/api/movies/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieFile }), // שליחת movieFile ב-body
        }
      );

      if (deleteResponse.ok) {
        setMessage("Movie deleted successfully!");

        // עדכון הרשימה המופעלת לאחר מחיקה
        setFilteredMovies((prevFiltered) =>
          prevFiltered.filter((movie) => movie._id !== movieId)
        );
      } else {
        const errorData = await deleteResponse.json();
        setMessage(`Failed to delete movie: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Server error: ${error.message}`);
    }
  };

  return (
    <div className="delete-page">
      <div className="modal">
        <h2>Delete Movie</h2>
        <div>
          <label htmlFor="movieName">Search Movie by Title:</label>
          <input
            type="text"
            id="movieName"
            name="movieName"
            value={movieName}
            onChange={handleSearch} // בצע חיפוש בעת שינוי הערך
            placeholder="Enter movie title"
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredMovies.length > 0 ? (
          <ul className="movies-list">
            {filteredMovies.map((movie) => (
              <li key={movie._id}>
                <span>{movie.title}</span>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(movie._id,movie.movieFile)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          movieName.trim() && <p>No matching movies found.</p>
        )}
        {message && <p>{message}</p>} {/* הצגת הודעות */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={toggleDeleteMovieModal}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DeleteMovie;
