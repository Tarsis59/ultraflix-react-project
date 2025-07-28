import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import "./MovieRow.css";

function MovieRow({ title, movies, myListIds, onUpdateMyList }) {
  // Se não houver filmes, não renderiza a fileira
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="movie-row-section">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-row-item">
            <Link to={`/movie/${movie.id}`} className="movie-link">
              <MovieCard
                movie={movie}
                myListIds={myListIds}
                onUpdateMyList={onUpdateMyList}
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRow;
