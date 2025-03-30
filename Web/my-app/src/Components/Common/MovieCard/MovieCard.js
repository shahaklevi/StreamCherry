import React, { useState, useEffect } from 'react';  // Add useEffect
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';
import MoviePopup from '../../MoviePopup/MoviePopup';  // Add MoviePopup import
import tokenVerification from '../../../tokenVerification/tokenVerification';  // Add tokenVerification import


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
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 2000);
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setIsPopupOpen(false);
  };

  const handlePlay = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token not found.");
        return;
      }

      const userData = await tokenVerification(token);
      console.log("User Data:", userData);
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
      console.log("Recommendation successful:", data);

      navigate(`/movie/${movie._id}`, { state: { movie } });
    } catch (error) {
      console.error("Error during handlePlay:", error.message);
    }
  };

  const handleInfo = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div 
    className={`movie-card-poster ${isHovered ? 'hovered' : ''}`}
    onClick={handlePlay}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <div className="image-container">
      <img
        src={getImageUrl()}
        className={`card-img-top ${isLoading ? 'loading' : ''}`}
        alt={movie.title}
        onError={() => {
          console.log('Image failed to load:', movie.movieImage);
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
    <div className="gradient-overlay" />
    <div className={`hover-overlay ${isHovered ? 'visible' : ''}`} />
    {isPopupOpen && (
      <MoviePopup
        movie={movie}
        onClose={() => setIsPopupOpen(false)}
        isOpen={isPopupOpen}
      />
    )}
  </div>
    
  );
}

export default MovieCard;