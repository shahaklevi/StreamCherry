import React from "react";
import { useLocation } from "react-router-dom";
import MovieView from "../Components/MovieView/MovieView";

const MoviePage = () => {
  const location = useLocation();
  const { movie } = location.state || {};

  return (
    <div>
      {movie ? (
        <MovieView 
          videoSrc={movie.movieFile} 
          movieTitle={movie.title} 
        />
      ) : (
        <p>Movie details not available</p>
      )}
    </div>
  );
};

export default MoviePage;