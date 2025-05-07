import MainPage from "./Pages/MainPage/MainPage";
import Login from "./Pages/Login/Login";
import AdminPage from "./Pages/AdminPage/AdminPage";
import SignUpMessage from "./Pages/SignUp/signUpForm/signUpForm";
import HomePage from "./Pages/HomePage/HomePage";
import SignUpForm from "./Pages/SignUp/signUpForm/signUpForm";
import MoviesPage from "./Pages/MoviesPage/MoviesPage";
import MoviePage from "./Pages/MoviePage/MoviePage";
import { UserProvider } from "./Contexts/UserContext";
import SearchPage from "./Pages/SearchPage/SearchPage";
import { TopMenuProvider } from "./Components/Common/TopMenu/TopMenuLogic";
import "./App.css";
import "./styles/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <TopMenuProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/home" element={<MainPage />} />
              <Route path="/SignUp" element={<SignUpMessage />} />
              <Route path="/FillDetails" element={<SignUpForm />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/search/:query?" element={<SearchPage />} />
              <Route path="/Admin" element={<AdminPage />} />
            </Routes>
          </div>
        </TopMenuProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
