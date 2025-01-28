import "./MainPage.css";
import VideoItem from "../Components/VideoItem/VideoItem";
import RowSlider from "../Components/RowSlider/RowSlider";
import NumericSlider from "../Components/NumericSlider/NumericSlider";
import TopMenu from "../Components/TopMenu/TopMenu";
import { useUser } from "../Contexts/UserContext";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../assets/useCategories";
import trendingMovies from "../assets/TrendingMovies";
import { useTopMenu } from "../Components/TopMenu/TopMenuLogic";
import tokenVerification from "../tokenVerification/tokenVerification";

function MainPage() {
  const categories = useCategories();
  const [recommendations, setRecommendations] = useState([]); // State to store recommended movies
  const [randomMovieId, setRandomMovieId] = useState(null);

  const {LogOut,isAdmin}=useTopMenu();
  const { logout, verifyToken,verifyAdminToken } = useUser();
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
  }, [verifyToken, logout, navigate]); // Dependencies for useEffect

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
        `http://localhost:3000/api/movies/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userId: userData._id,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations`);
      }

      const data = await response.json();
      console.log("Recommendations:", data);

      // Update state with recommended movies
      setRecommendations(data); // Assuming the API returns an array under recommendedMovies
      console.log("Recommended:", data);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    }
  };
  fetchRecommendations();
}, []);
useEffect(() => {
  if (recommendations.movies) {
    const allMovieIds = Object.values(recommendations.movies)
      .flat()
      .map(movie => movie._id);
      
    const newRandomId = allMovieIds.length > 0 
      ? allMovieIds[Math.floor(Math.random() * allMovieIds.length)]
      : null;
      
    setRandomMovieId(newRandomId);
  }
}, [recommendations]);

  return (
    <div className="MainPage">
      {/* Video Background Section */}
      <div className="VideoBackground">
      <VideoItem movieId={randomMovieId} />
    </div>
      <div className="overlay">
        <TopMenu LogOutSystem={LogOut} VerifyAdmin={isAdmin} />
      </div>
      {/* Main Content Section */}
      <div className="MainContent">
        {/* <NumericSlider title="Trending Now" movies={trendingMovies} /> */}
        {/* Loop through all categories and create a RowSlider for each */}
        {Object.entries(recommendations.movies || {}).map(([categoryName, movies]) => {
  const movieIds = movies.map(movie => movie._id);
  
  return movieIds.length > 0 && (
    <RowSlider
      key={categoryName}
      title={categoryName}
      movieIds={movieIds}
    />
  );
})}
      </div>
    </div>
  );
}

export default MainPage;
