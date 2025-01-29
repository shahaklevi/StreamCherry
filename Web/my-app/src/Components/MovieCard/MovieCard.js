import React, { useState, useRef, useEffect } from "react";
import "./MovieCard.css";
import MoviePopup from "../MoviePopup/MoviePopup";
import tokenVerification from "../../tokenVerification/tokenVerification";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Print movie details once when the component is mounted
  useEffect(() => {
    console.log("Movie Details:", { movie });
  }, [movie]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoRef.current.paused && !videoRef.current.ended) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
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
            // Authorization: `Bearer ${token}`,
            userId: userData._id,
          },
          body: JSON.stringify({ userId: userData._id }),
        }
      );

      const data = await response.json();
      console.log("Recommendation successful:", data);

      // Navigate to MoviePage with movie details
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
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={`http://localhost:3000/movieuploads/${movie.movieFile}`}
        className="card-video-top"
        muted
        loop
      />
      <div className="card-body">
        <div className="card-text">
          <p className="movie-title"> {movie.title} </p>
          <button className="icon-button" onClick={handlePlay}>
            <i className="bi bi-play-circle-fill"></i>
          </button>
          <span className="movie-duration">{movie.duration}</span>
          <button className="icon-button info" onClick={handleInfo}>
            <i className="bi bi-info-circle"></i>
          </button>
        </div>
      </div>
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