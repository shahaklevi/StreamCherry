import MainPage from "./MainPage/MainPage";
import Login from "./Login/Login";
import AdminPage from "./AdminPage/AdminPage";
import SignUpMessage from "./SignUp/SignUpMessage/SignUpMessage";
import HomePage from "./HomePage/HomePage";
import SignUpForm from "./SignUp/signUpForm/signUpForm";
import MoviesPage from "./MoviesPage/MoviesPage";
import MoviePage from "./MoviePage/MoviePage";
import { UserProvider } from "./Contexts/UserContext";
import SearchPage from "./SearchPage/SearchPage";
import "./App.css";
import "./styles/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopMenu from "./Components/TopMenu/TopMenu";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUpMessage />} />
            <Route path="/FillDetails" element={<SignUpForm />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/home" element={<MainPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/search/:query?" element={<SearchPage />} />
            <Route path="/admin-zone" element={<AdminPage />} />
          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
