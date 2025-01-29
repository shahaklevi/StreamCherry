import React, { useRef, useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./NumericSlider.css";
import StaticMovieCard from "../StaticMovieCard/StaticMovieCard"; 
function NumericSlider({ title,movieIds}) {
  const sliderRef = useRef(null);
  const [movies, setMovies] = useState([]);
  // Function to fetch movie details by ID
   const fetchMovieDetails = async () => {
     try {
       const moviePromises = movieIds.map(async (id) => {
         const response = await fetch(`http://localhost:3000/api/movies/${id}`);
         if (!response.ok) {
           throw new Error(`Failed to fetch movie with ID: ${id}`);
         }
         return response.json();
       });
 
       // Wait for all promises to resolve
       const fetchedMovies = await Promise.all(moviePromises);
       setMovies(fetchedMovies); // Update state with movie details
     } catch (error) {
       console.error("Error fetching movies:", error);
     }
   };
 
   // Fetch movie details on component mount
   useEffect(() => {
     fetchMovieDetails();
   }, [movieIds]); // Dependency array ensures this runs only when movieIds changes
 
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
      <button className="numeric-arrow left-arrow" onClick={scrollLeft}>
  <img src="/media/Buttons/leftIndicator.svg" alt="left" />
</button>
<div className="slider-numeric-container" ref={sliderRef}>
  {movies.map((movie, index) => (
    <div className="numeric-item-container" key={index}>
      <img 
        src={`/media/Numbers/${index + 1}.png`} 
        className="number-icon" 
        alt={`Number ${index + 1}`} 
      />
      <StaticMovieCard key={index} movie={movie} />
    </div>
  ))}
</div>
      <button className="numeric-arrow right-arrow" onClick={scrollRight}>
  <img src="/media/Buttons/rightIndicator.svg" alt="right" />
</button>
    </div>
  );
}

export default NumericSlider;
