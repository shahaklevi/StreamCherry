import "./SmallMovieInfo.css";

import React, { useEffect, useRef } from "react";

function SmallMovieInfo({ movie }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    video.addEventListener("loadeddata", () => {
      // Draw the first frame of the video onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    });
  }, []);

  return (
    <div>
      <video ref={videoRef} src={movie.src} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="320" height="180" />
    </div>
  );
}

export default SmallMovieInfo;