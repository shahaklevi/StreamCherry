import React, { useRef, useState, useEffect } from "react";

import "./MovieView.css";
import { useNavigate } from "react-router-dom";

const MovieView = ({ videoSrc, movieTitle }) => {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const handleRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimeout = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current && progressRef.current && handleRef.current) {
        const { currentTime, duration } = videoRef.current;
        const progressPercentage = (currentTime / duration) * 100;
        progressRef.current.style.width = `${progressPercentage}%`;
        handleRef.current.style.left = `${progressPercentage}%`;
      }
    };

    const video = videoRef.current;
    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (time) => {
    videoRef.current.currentTime += time;
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, 5000); // 5 seconds
  };

  useEffect(() => {
    const handleMouseMove = () => {
      showControls();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="movie-view" onMouseMove={showControls}>
<button
  onClick={() => navigate(-1)}
  className="movie-view-back-button"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-left"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
    />
  </svg>
</button>
      <video
        ref={videoRef}
        className="movie-video"
        src={videoSrc}
        controls={false}
        onClick={handlePlayPause}
      />
      <div
        className={`progress-container ${controlsVisible ? "visible" : "hidden"}`}
      >
        <div className="progress-filled" ref={progressRef}></div>
        <div className="progress-handle" ref={handleRef}></div>
      </div>
      <div
        className={`movie-controls ${controlsVisible ? "visible" : "hidden"}`}
      >
        <button className="control-button" onClick={() => handleSkip(-10)}>
          <img src="/media/Buttons/Replay10.svg" alt="Replay 10 seconds" />
        </button>
        <button className="control-button play-button" onClick={handlePlayPause}>
          <img
            src={
              isPlaying
                ? "/media/Buttons/Pause.svg"
                : "/media/Buttons/Play.svg"
            }
            alt={isPlaying ? "Pause" : "Play"}
          />
        </button>
        <button className="control-button" onClick={() => handleSkip(10)}>
          <img src="/media/Buttons/Forward10.svg" alt="Forward 10 seconds" />
        </button>
        <p className="movie-title">{movieTitle}</p>
        <button className="control-button" onClick={handleFullscreen}>
          <img src="/media/Buttons/FullScreen.svg" alt="Fullscreen" />
        </button>
      </div>
    </div>
  );
};

export default MovieView;
