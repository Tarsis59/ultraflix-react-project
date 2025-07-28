import { AnimatePresence } from "framer-motion";
import {
  Route,
  Link as RouterLink,
  Routes,
  useLocation,
} from "react-router-dom";

// Contexto
import { GenreProvider } from "./context/GenreContext";

// Componentes
import AuthStatus from "./components/AuthStatus";
import GenreNav from "./components/GenreNav";

// Páginas
import GenrePage from "./pages/GenrePage";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import MyListPage from "./pages/MyListPage";
import PersonPage from "./pages/PersonPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const location = useLocation();

  return (
    <GenreProvider>
      <header className="header">
        <div className="header-container">
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "var(--accent-primary)" }}
          >
            <h1>ULTRAFLIX</h1>
          </RouterLink>
          <AuthStatus />
        </div>
      </header>

      <GenreNav />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/minha-lista" element={<MyListPage />} />
          <Route path="/person/:personId" element={<PersonPage />} />
          <Route path="/perfil" element={<ProfilePage />} /> {}
        </Routes>
      </AnimatePresence>
    </GenreProvider>
  );
}

export default App;
