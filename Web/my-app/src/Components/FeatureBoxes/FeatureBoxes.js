import React from "react";
import "./FeatureBoxes.css";

// Example SVG icons (you can replace these with your own images or icon library)
const InstantStreamingIcon = () => (
  <div>
    <img src = "media/Svgs/movie-film.svg" alt = "movie-film" className="feature-icon"/>
  </div>
);

const WatchEverywhereIcon = () => (
  <div>
    <img src="media/Svgs/popcorn-movie.svg" alt="popcorn-movie" className="feature-icon"/>
  </div>
);

const SmartRecommendationsIcon = () => (
  <div>
    <img src="media/Svgs/movie-ticket.svg" alt="movie-ticket" className="feature-icon"/>
  </div>
);

const FeatureBoxes = () => {
  return (
    <div className="feature-boxes">
      <div className="feature-box">
        <InstantStreamingIcon />
        <h3>Instant Streaming</h3>
       
      </div>
      <div className="feature-box">
        <WatchEverywhereIcon />
        <h3>Watch Everywhere</h3>
        
      </div>
      <div className="feature-box">
        <SmartRecommendationsIcon />
        <h3>Smart Recommendations</h3>
        
      </div>
    </div>
  );
};

export default FeatureBoxes;
