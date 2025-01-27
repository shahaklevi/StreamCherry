import React, { useState, useRef, useEffect } from "react";
import "./MovieCard.css";
import MoviePopup from "../MoviePopup/MoviePopup";
import tokenVerification from "../../tokenVerification/tokenVerification";

function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoRef = useRef(null);

  // Print movie details once when the component is mounted
  useEffect(() => {
    console.log("Movie Details:", { movie });
  }, []); // Runs only once on component mount

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
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

      console.log("User ID:", userData._id);

      const response = await fetch(
        `http://localhost:3000/api/movies/${movie._id}/recommend/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userId: userData._id, // Custom header with user ID
          },
        }
      );
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
