import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Hooks e Serviços
import { useAuth } from "../context/AuthContext";
import { useGenres } from "../context/GenreContext";
import { getMoviesByGenre, getMyListIds } from "../services/api";

// Componentes
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";

function GenrePage() {
  const { genreId } = useParams();
  const allGenres = useGenres();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const [myListIds, setMyListIds] = useState(new Set());

  const currentGenre = allGenres.find((g) => g.id === parseInt(genreId));

  const fetchMyList = useCallback(() => {
    if (currentUser) {
      getMyListIds(currentUser.uid).then(setMyListIds);
    } else {
      setMyListIds(new Set());
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMyList();
  }, [currentUser, fetchMyList]);

  const observer = useRef();
  const lastMovieElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [genreId]);

  useEffect(() => {
    if (!genreId) return;
    setIsLoading(true);
    getMoviesByGenre(genreId, page)
      .then((newMovies) => {
        setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));
        setHasMore(newMovies.length > 0);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [genreId, page]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="main-content container">
        <h2 className="page-title">
          {currentGenre ? `Gênero: ${currentGenre.name}` : "Carregando..."}
        </h2>
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-link"
            >
              <motion.div
                ref={movies.length === index + 1 ? lastMovieElementRef : null}
              >
                <MovieCard
                  movie={movie}
                  myListIds={myListIds}
                  onUpdateMyList={fetchMyList}
                />
              </motion.div>
            </Link>
          ))}
          {isLoading &&
            movies.length === 0 &&
            Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </main>
    </motion.div>
  );
}

export default GenrePage;
