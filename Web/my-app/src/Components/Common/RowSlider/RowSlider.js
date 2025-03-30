import React, { useRef, useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./RowSlider.css";

function RowSlider({ title, movieIds }) {
  const sliderRef = useRef(null);
  const [movies, setMovies] = useState([]);

  const fetchMovieDetails = async () => {
    try {
      const moviePromises = movieIds.map(async (id) => {
        const token = await localStorage.getItem("jwtToken");
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
      const fetchedMovies = await Promise.all(moviePromises);
      setMovies(fetchedMovies); // Update state with movie details
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieIds]); // Dependency array ensures this runs only when movieIds changes

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" }); // Scroll left by 320px
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" }); // Scroll right by 320px
    }
  };

  return (
    <div className="row-slider">
      <h2 className="row-title">{title}</h2>
      <div className="slider-container" ref={sliderRef}>
        <div className="slider-side">
        <button className="arrow left-arrow" onClick={scrollLeft}>
          <img src="/media/Buttons/leftIndicator.svg" alt="left" />
        </button>
        </div>
        <div className="slider-center">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
          </div>
        <div className="slider-side">
        <button className="arrow right-arrow" onClick={scrollRight}>
          <img src="/media/Buttons/rightIndicator.svg" alt="right" />
        </button>
        </div>
      </div>
    </div>
  );
}

export default RowSlider;