import React, { useState, useRef,useEffect } from "react";
import "./VideoItem.css";
import PlayButton from '../PlayButton/PlayButton';
import InfoButton from '../InfoButton/InfoButton';
import MoviePopup from '../MoviePopup/MoviePopup';
function VideoItem({movieId}){
  const [movie, setMovie] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoRef = useRef(null);
  console.log(movieId); 
  const fetchSingleMovie = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${movieId}`);
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
  
  const handlePlay = () => {
    console.log('Play clicked', movie);
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
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        className="video"
      >
        <source src={`http://localhost:3000/movieuploads/${movie.movieFile}`} type="video/mp4" />
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