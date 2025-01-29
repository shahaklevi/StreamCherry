import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook to access route params
import SearchResults from "../Components/SearchResults/SearchResults";
import TopMenu from "../Components/TopMenu/TopMenu";

function SearchPage() {
  const { query } = useParams(); // Get the query parameter from the URL
  const [movieList, setMovieList] = useState([]); // State to hold fetched movies
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error messages

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) {
        setMovieList([]); // Clear movies when query is empty
        return;
      }

      console.log("Fetching movies for query:", query);
      setLoading(true); // Set loading state
      setError(""); // Clear previous errors

      try {
        const token = await localStorage.getItem("jwtToken"); // Retrieve token from context
        if (!token) {
          console.error("No token available, skipping request.");
          return;
        }
        const response = await fetch(
          `http://localhost:3000/api/movies/search/${query}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          }
        );

        // Check if the response is successful
        if (!response.ok) {
          // Extract the error message
          const errorMessage = response.headers
            .get("Content-Type")
            ?.includes("application/json")
            ? (await response.json()).error // Parse JSON error
            : await response.text(); // Parse plain text error
          throw new Error(errorMessage);
        }

        const data = await response.json(); // Parse the JSON response
        if (Array.isArray(data.movies)) {
          setMovieList(data.movies); // Update the movie list
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching movies:", err.message);
        setError(`Failed to fetch movies: ${err.message}`); // Display the error message to the user
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchMovies();
  }, [query]); // Run effect whenever the query changes

  return (
    <div className="search-page">
      <TopMenu />
      <SearchResults movies={movieList} />
    </div>
  );
}

export default SearchPage;
