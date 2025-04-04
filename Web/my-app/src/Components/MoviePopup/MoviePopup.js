import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./MoviePopup.css";
import SmallMovieInfo from "../SmallMovieInfo/SmallMovieInfo";
import tokenVerification from "../../tokenVerification/tokenVerification";
import PlayButton from "../PlayButton/PlayButton";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const MoviePopup = ({ movie, onClose }) => {

  const [categoryNames, setCategoryNames] = useState([]); // State to hold category names
  const [recommendedMovies, setRecommendedMovies] = useState([]); // State to store recommended movies
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoryPromises = movie.categories.map(async (categoryId) => {
          const token = await localStorage.getItem("jwtToken"); // Retrieve token from context
          if (!token) {
            console.error("No token available, skipping request.");
            return;
          }
          const response = await fetch(
            `${API_BASE_URL}/api/categories/${categoryId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json",
              },
            }
          );
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
  // GET Request inside useEffect
  useEffect(() => {
    const fetchRecommendations = async () => {
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
          `${API_BASE_URL}/api/movies/${movie._id}/recommend/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
              userId: userData._id,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations for movie ID: ${movie._id}`);
        }

        const data = await response.json();
        console.log("Recommendations:", data);

        // Update state with recommended movies
        setRecommendedMovies(data); // Assuming the API returns an array under recommendedMovies
        console.log("Recommended Movies:", data);
      } catch (error) {
        console.error("Error fetching recommendations:", error.message);
      }
    };
    fetchRecommendations();
  }, [movie._id]);

  return ReactDOM.createPortal(

    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        {/* Video Section */}
        <video className="popup-video" controls>
          <source src={`${API_BASE_URL}/${movie.movieFile}`} type="video/mp4" />
        </video>

        {/* Details Section */}
        <div className="popup-details">

          {/* Left section */}
          <div className="popup-left">
            <div className="popup-header">
              <h2>{movie.title}</h2>
              
              <PlayButton onClick={handlePlay} />
            </div>
            <div className="popup-additional-info">
              <p>{movie.releaseYear}</p>
              <p>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>              <p className="rating"> 10 ⭐️</p>
            </div>
            <div className="popup-description">
              <p>{movie.description}</p>
            </div>
          </div>

          {/* Right section */}
          <div className="popup-right">
            <div className="popup-cast">
              <p>
                <span className="cast-title">Cast </span>
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
                <span className="categories-title">Categories </span>
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
        {/* Additional Movies Section */}
        <div className="popup-additional-movies">
          <h3>More like this</h3>
          <SmallMovieInfo movies={recommendedMovies} />
        </div>
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default MoviePopup;