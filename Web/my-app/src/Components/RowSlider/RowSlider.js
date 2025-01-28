import React, { useRef, useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./RowSlider.css";

function RowSlider({ title, movieIds }) {
  const sliderRef = useRef(null);
  const [movies, setMovies] = useState([]); // State to store fetched movie details

  // Function to fetch movie details by ID
  const fetchMovieDetails = async () => {
    try {
      const moviePromises = movieIds.map(async (id) => {
        const token = await localStorage.getItem("jwtToken"); // Retrieve token from context
          if (!token) {
            console.error("No token available, skipping request.");
            return;
          }
          const response = await fetch(`http://localhost:3000/api/movies/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          });
        if (!response.ok) {
          throw new Error(`Failed to fetch movie with ID: ${id}`);
        }
        return response.json();
      });

      // Wait for all promises to resolve
      const fetchedMovies = await Promise.all(moviePromises);
      console.log("Fetched movies:", fetchedMovies); // Log fetched movies
      setMovies(fetchedMovies); // Update state with movie details
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch movie details on component mount
  useEffect(() => {
    fetchMovieDetails();
  }, [movieIds]); // Dependency array ensures this runs only when movieIds changes

  // Log movies whenever the state updates
  useEffect(() => {
    console.log("Updated movies state:", movies);
  }, [movies]);

  // Scroll Left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" }); // Adjust scroll distance based on card width
    }
  };

  // Scroll Right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" }); // Adjust scroll distance based on card width
    }
  };

  return (
    <div className="row-slider">
      {/* Title */}
      <h2 className="row-title">{title}</h2>

      {/* Arrow Controls */}
      <button className="arrow left-arrow" onClick={scrollLeft}>
  <img src="/media/Buttons/leftIndicator.svg" alt="left" />
</button>
      <div className="slider-container" ref={sliderRef}>
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}

<button className="arrow right-arrow" onClick={scrollRight}>
  <img src="/media/Buttons/rightIndicator.svg" alt="right" />
</button>
    </div>
    </div>
  );
}

export default RowSlider;