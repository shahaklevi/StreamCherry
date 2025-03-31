import React from "react";
import MovieCard from "../Common/MovieCard/MovieCard";
import "./SearchResults.css";

function SearchResults({ movies }) {
  return (
    <div className="search-results-container">
      {movies.length > 0 ? (
        <>
          <h1>Search Results</h1>
          <div className="movie-grid">
            {movies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        </>
      ) : (
        <div className="no-results-message">
          <i className="bi bi-search" style={{ fontSize: "40px", color: "gray" }}></i>
          <h1>No Results Found</h1>
          <p>Try searching for a different title, person, or genre.</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
