import "./MainPage.css";
import VideoItem from "Components/MoviePage/VideoItem/VideoItem";
import RowSlider from "Components/Common/RowSlider/RowSlider";
import TopMenu from "Components/Common/TopMenu/TopMenu";
import { useUser } from "Contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopMenu } from "Components/Common/TopMenu/TopMenuLogic";
import tokenVerification from "tokenVerification/tokenVerification";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
function MainPage() {
  const [recommendations, setRecommendations] = useState([]); // State to store recommended movies
  const [randomMovieId, setRandomMovieId] = useState(null);
  const [randomMovies, setRandomMovies] = useState([]);
  const [isTop, setIsTop] = useState(true);  // New state to track scroll position

  const { LogOut, isAdmin } = useTopMenu();
  const { logout, verifyToken, verifyAdminToken } = useUser();
  const navigate = useNavigate();

  // Perform token verification on component mount
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken(); // Assume verifyToken returns a boolean
      if (!isValid) {
        navigate("/login"); // Redirect to login page if token is invalid
      }
    };

    checkToken();
  }, []); // Dependencies for useEffect

  // GET Request inside useEffect
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("Token not found.");
          return;
        }

        console.log("Token found:", token);

        const userData = await tokenVerification(token);
        if (!userData) {
          console.error("User data verification failed.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/movies/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: userData._id,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations`);
        }

        const data = await response.json();
        console.log("Fetched recommendations:", data);

        // Update state with recommended movies
        setRecommendations(data); // Assuming the API returns an array under recommendedMovies
      } catch (error) {
        console.error("Error fetching recommendations:", error.message);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (!recommendations.movies || randomMovieId !== null) {
      return;
    }

    const allMovieIds = Object.values(recommendations.movies)
      .flat()
      .map((movie) => movie._id);

    const newRandomId =
      allMovieIds.length > 0
        ? allMovieIds[Math.floor(Math.random() * allMovieIds.length)]
        : null;

    setRandomMovieId(newRandomId);
    console.log(`Settings random movie ID: ${newRandomId}`);
  }, [recommendations]);

  useEffect(() => {
    if (recommendations.movies) {
      // Get all movie IDs and flatten
      const allMovieIds = Object.values(recommendations.movies)
        .flat()
        .map((movie) => movie._id);

      // Shuffle array using Fisher-Yates algorithm
      const shuffled = [...allMovieIds];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Take first 10 unique IDs (or less if not enough)
      const uniqueIds = [...new Set(shuffled)];
      const selectedIds = uniqueIds.slice(0, Math.min(10, uniqueIds.length));

      setRandomMovies(selectedIds);
    }
  }, [recommendations]);

  // Add scroll event listener to update the background transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="MainPage">
      {/* Video Background Section */}
      <div className="VideoBackground">
        <VideoItem movieId={randomMovieId} />
      </div>
      <div className="overlay">
        <TopMenu LogOutSystem={LogOut} VerifyAdmin={isAdmin} isTop={isTop} />
      </div>
      {/* Main Content Section */}
      <div className="MainContent">

        {/* Loop through all categories and create a RowSlider for each */}
        {Object.entries(recommendations.movies || {}).map(
          ([categoryName, movies]) => {
            const movieIds = movies.map((movie) => movie._id);

            return (
              movieIds.length > 0 && (
                <RowSlider
                  key={categoryName}
                  title={categoryName}
                  movieIds={movieIds}
                />
              )
            );
          }
        )}
      </div>
    </div>
  );
}

export default MainPage;
