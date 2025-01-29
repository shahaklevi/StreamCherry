import React, { useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './StaticMovieCard.css';
//HODAYA - ADD DELAY BETWEEN HOVER AND MOVIE CARD APPEARANCE (SET TIMEOUT)
//setTimeout(() => setIsHovered(true), 1000);
// do action after 1 second
function StaticMovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="static-movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <img
        src="/media/squirel.jpeg"
        alt="squirel"
        className="static-card-image"
        />
      ) : (
        <MovieCard movie={movie} />
      )}
    </div>
  );
}

export default StaticMovieCard;