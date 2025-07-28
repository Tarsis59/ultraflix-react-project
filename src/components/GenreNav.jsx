import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGenres } from "../context/GenreContext";
import "./GenreNav.css";

function GenreNav() {
  const genres = useGenres();
  const { currentUser } = useAuth(); // Pega o usuário logado
  const location = useLocation();

  return (
    <nav className="genre-nav">
      <div className="container">
        {}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive || location.pathname.startsWith("/genre")
              ? "genre-link active"
              : "genre-link"
          }
          end
        >
          Populares
        </NavLink>

        {}
        {currentUser && (
          <NavLink
            to="/minha-lista"
            className={({ isActive }) =>
              isActive ? "genre-link active" : "genre-link"
            }
          >
            Minha Lista
          </NavLink>
        )}

        {}
        {genres.map((genre) => (
          <NavLink
            key={genre.id}
            to={`/genre/${genre.id}`}
            className={({ isActive }) =>
              isActive ? "genre-link active" : "genre-link"
            }
          >
            {genre.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default GenreNav;
