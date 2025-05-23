import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieView from "Components/MoviePage/MovieView/MovieView";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const MoviePage = () => {

  const location = useLocation();
  const { movie } = location.state || {};
  console.log("Movie Details:", { movie });

  return (
    <div>
      {movie ? (
        <MovieView
          videoSrc={`${API_BASE_URL}/${movie.movieFile}`}
          movieTitle={movie.title}
        />
      ) : (
        <p>Movie details not available</p>
      )}
    </div>
  );
};


export default MoviePage;