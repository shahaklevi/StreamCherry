import "./MoviesPage.css";
import VideoItem from "../Components/VideoItem/VideoItem";
import RowSlider from "../Components/Common/RowSlider/RowSlider";
import NumericSlider from "../Components/NumericSlider/NumericSlider";
import TopMenu from "../Components/TopMenu/TopMenu";
import { useUser } from "../Contexts/UserContext";
import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../assets/useCategories";
import trendingMovies from "../assets/TrendingMovies";

function MoviesPage() {
  const categories = useCategories();
  const { logout, verifyToken, verifyAdminToken } = useUser();
  const navigate = useNavigate();

  const LogOut = () => {
    logout();
    navigate("/");
  };
  const isAdmin = () => {
    verifyAdminToken();
  };
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

  const promotedCategories = categories.filter((category) => category.promoted);
  return (
    <div className="MoviesPage">
      {/* Header */}
      <div className="header"> Movies</div>
      <div className="overlay">
        <TopMenu LogOutSystem={LogOut} VerifyAdmin={isAdmin} />
      </div>
      {/* Main Content Section */}
      <div className="MainContent">
        {/* Loop through all promoted categories and create a RowSlider for each */}
        {promotedCategories.map(
          (category) =>
            category.movies.length > 0 && (
              <RowSlider
                key={category.name} // Unique key for each slider
                title={category.name} // Display the category name as the title
                movieIds={category.movies} // Pass the movies specific to the category
              />
            )
        )}
      </div>
    </div>
  );
}

export default MoviesPage;
