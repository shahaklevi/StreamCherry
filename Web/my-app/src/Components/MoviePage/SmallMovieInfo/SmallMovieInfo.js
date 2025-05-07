import React, { useEffect, useRef } from "react";
import "./SmallMovieInfo.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const SmallMovieInfo = ({ movies }) => {
  const videoRefs = useRef([]);
  const canvasRefs = useRef([]);

  useEffect(() => {
    movies.forEach((movie, index) => {
      const video = videoRefs.current[index];
      const canvas = canvasRefs.current[index];

      if (video && canvas) {
        video.addEventListener("canplay", () => {
          console.log(`Video "${movie.title}" is ready to play.`);

          const context = canvas.getContext("2d");
          if (context) {
            try {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              console.log(`Frame drawn for movie: "${movie.title}".`);
            } catch (error) {
              console.error(`Failed to draw image for movie "${movie.title}":`, error);
            }
          } else {
            console.error(`Canvas context for movie "${movie.title}" is not available.`);
          }
        });
        video.load();
      }
    });
  }, [movies]);

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={`${API_BASE_URL}/${movie.movieFile}`}
            style={{ display: "none" }} 
            preload="metadata" 
          />
          <canvas
            ref={(el) => (canvasRefs.current[index] = el)}
            width="230"
            height="130"
            className="movie-image"
          />
          <h4 className="movie-title">{movie.title}</h4>
          <p className="movie-description">{movie.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SmallMovieInfo;