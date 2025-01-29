import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieView from "../Components/MovieView/MovieView";


const MoviePage = () => {

  const fetchMovieInfo = async (movieId) => {
    try {
      const token = await localStorage.getItem("jwtToken"); // Retrieve token from context
      if (!token) {
        console.error("No token available, skipping request.");
        return;
      }
      const response = await fetch(`http://localhost:3000/api/movies/${movieId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch movie with ID: ${movieId}`);
      }
      const movie = await response.json();
      return movie;
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  }
  const location = useLocation();
  const { movie } = location.state || {};
  console.log("Movie Details:", { movie });

  return (
    <div>
      {movie ? (
        <MovieView
          videoSrc={`http://localhost:3000/${movie.movieFile}`}
          movieTitle={movie.title}
        />
      ) : (
        <p>Movie details not available</p>
      )}
    </div>
  );
};


export default MoviePage;