import React, { useEffect, useRef } from "react";
import "./SmallMovieInfo.css";

const SmallMovieInfo = ({ movies }) => {
  const videoRefs = useRef([]);
  const canvasRefs = useRef([]);

  useEffect(() => {
    movies.forEach((movie, index) => {
      const video = videoRefs.current[index];
      const canvas = canvasRefs.current[index];

      if (video && canvas) {
        // לוודא שהווידאו נטען
        video.addEventListener("canplay", () => {
          console.log(`Video "${movie.title}" is ready to play.`);

          const context = canvas.getContext("2d");
          if (context) {
            // ציור הפריים הראשון
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

        // נוודא שהווידאו מתחיל לטעון
        video.load();
      }
    });
  }, [movies]);

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          {/* רכיב וידאו חבוי */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={`http://localhost:3000/movieuploads/${movie.movieFile}`}
            style={{ display: "none" }} // הסתרת הווידאו
            preload="metadata" // טוען רק את המידע של הסרטון
          />
          {/* Canvas להצגת תמונה קפואה */}
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