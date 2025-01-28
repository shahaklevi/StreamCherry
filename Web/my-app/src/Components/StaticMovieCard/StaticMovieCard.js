import React, { useState } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './StaticMovieCard.css';

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