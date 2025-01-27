import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./MoviePopup.css";

const MoviePopup = ({ movie, onClose }) => {
  const [categoryNames, setCategoryNames] = useState([]); // State to hold category names

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoryPromises = movie.categories.map(async (categoryId) => {
          const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch category with ID: ${categoryId}`);
          }
          const category = await response.json();
          return category.name; // Return the category name
        });

        const fetchedCategoryNames = await Promise.all(categoryPromises);
        setCategoryNames(fetchedCategoryNames); // Update the state with the names
      } catch (error) {
        console.error("Error fetching category names:", error);
      }
    };

    if (movie.categories && movie.categories.length > 0) {
      fetchCategoryNames();
    }
  }, [movie.categories]);

  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        {/* Video Section */}
        <video className="popup-video" controls>
          <source src={`http://localhost:3000/movieuploads/${movie.movieFile}`} type="video/mp4" />
        </video>

        {/* Details Section */}
        <div className="popup-details">

          {/* Left section */}
          <div className="popup-left">
            <div className="popup-header">
              <h2>{movie.title}</h2>
            </div>
            <div className="popup-additional-info">
              <p>{movie.releaseYear}</p>
              <p>{movie.duration}</p>
              <p className="rating">{movie.rating}</p>
            </div>
            <div className="popup-description">
              <p>{movie.description}</p>
            </div>
          </div>

          {/* Right section */}
          <div className="popup-right">
            <div className="popup-cast">
              <p>
                <span className="cast-title">Cast: </span>
                {movie.cast.map((actor, index) => (                  
                  <span key={index} className="actor-name">
                    {actor}
                    {index < movie.cast.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
            <div className="popup-categories">
              <p>
                <span className="categories-title">Categories: </span>
                {categoryNames.map((categoryName, index) => (
                  <span key={index} className="category-name">
                    {categoryName}
                    {index < categoryNames.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default MoviePopup;
