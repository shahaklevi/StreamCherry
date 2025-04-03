import React, { useState, useRef, useEffect } from "react";
import "./VideoItem.css";
import PlayButton from "../PlayButton/PlayButton";
import InfoButton from "../InfoButton/InfoButton";
import MoviePopup from "../MoviePopup/MoviePopup";
import tokenVerification from "../../tokenVerification/tokenVerification";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function VideoItem({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const fetchSingleMovie = async (movieId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token not found.");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/movies/${movieId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch movie with ID: ${movieId}`);
      }
      const movieData = await response.json();
      return movieData;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  };
  useEffect(() => {
    const loadMovie = async () => {
      if (movieId) {
        const data = await fetchSingleMovie(movieId);
        setMovie(data);
      }
    };
    loadMovie();
  }, [movieId]);

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
        `${API_BASE_URL}/api/movies/${movie._id}/recommend/`,
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

  if (!movie) return null;
  return (
    <div className="Video-item">
      <video ref={videoRef} autoPlay muted loop className="video">
        <source
          src={`${API_BASE_URL}/${movie.movieFile}`}
          type="video/mp4"
        />
      </video>

      <div className="video-item-content">
        <p className="movie-title">{movie.title}</p>
        <p className="movie-description">{movie.description}</p>
        <div className="button-container">
          <PlayButton onClick={handlePlay} />
          <InfoButton onClick={handleInfo} />
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

export default VideoItem;
