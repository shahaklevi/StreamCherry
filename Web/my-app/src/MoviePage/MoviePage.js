import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieView from "../Components/MovieView/MovieView";


const MoviePage = () => {

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