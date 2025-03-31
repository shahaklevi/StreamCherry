import React, { useState, useEffect } from 'react';
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';
import MoviePopup from '../../MoviePopup/MoviePopup';
import tokenVerification from '../../../tokenVerification/tokenVerification';

function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const defaultImage = "/netflix.png";
  const navigate = useNavigate();

  const getImageUrl = () => {
    if (!movie.movieImage || imageError) {
      return defaultImage;
    }
    return `http://localhost:3000/${movie.movieImage}`;
  };

  // Cleanup hover timer on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  // Handle mouse enter with a delay
  const handleMouseEnter = () => {
    const timer = setTimeout(() => {
      setIsHovered(true);
      setIsPopupOpen(true);
    }, 1000); // Wait for 1 second before triggering
    setHoverTimer(timer);
  };

  // Handle mouse leave and clear the timer
  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer); // Clear the timer if the mouse leaves before 1 second
    }
    setIsHovered(false);
  };

  // Handle play button click
  const handlePlay = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token not found.");
        return;
      }

      const userData = await tokenVerification(token);
      if (!userData) {
        console.error("User data verification failed.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/movies/${movie._id}/recommend/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            userId: userData._id,
          },
          body: JSON.stringify({ userId: userData._id }),
        }
      );

      const data = await response.json();
      navigate(`/movie/${movie._id}`, { state: { movie } });
    } catch (error) {
      console.error("Error during handlePlay:", error.message);
    }
  };

  // Close the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div
      className={`movie-card-poster ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} // Ensure the timer is cleared on mouse leave
    >
      <img
        src={getImageUrl()}
        className={`card-img-top ${isLoading ? 'loading' : ''}`}
        alt={movie.title}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
      {isPopupOpen && (
        <MoviePopup
          movie={movie}
          onClose={handleClosePopup}
          isOpen={isPopupOpen}
        />
      )}
    </div>
  );
}

export default MovieCard;