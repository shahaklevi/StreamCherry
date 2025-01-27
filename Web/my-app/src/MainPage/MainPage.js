import "./MainPage.css";
import VideoItem from "../Components/VideoItem/VideoItem";
import RowSlider from "../Components/RowSlider/RowSlider";
import NumericSlider from "../Components/NumericSlider/NumericSlider";
import TopMenu from "../Components/TopMenu/TopMenu";
import { useUser } from "../Contexts/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../assets/useCategories";
import trendingMovies from "../assets/TrendingMovies";
import { useTopMenu } from "../Components/TopMenu/TopMenuLogic";
function MainPage() {

  const categories = useCategories();
 
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

  return (
    <div className="MainPage">
      {/* Video Background Section */}
      <div className="VideoBackground">
        <VideoItem />
      </div>
      <div className="overlay">
        <TopMenu LogOutSystem={LogOut} VerifyAdmin={isAdmin} />
      </div>
      {/* Main Content Section */}
      <div className="MainContent">
        <NumericSlider title="Trending Now" movies={trendingMovies} />
        {/* Loop through all categories and create a RowSlider for each */}
        {categories.map(
          (category) =>
            category.movies.length > 0 && (
              <RowSlider
                key={category.name} // Unique key for each slider
                title={category.name} // Display the category name as the title
                movies={category.movies} // Pass the movies specific to the category
              />
            )
        )}
      </div>
    </div>
  );
}

export default MainPage;
