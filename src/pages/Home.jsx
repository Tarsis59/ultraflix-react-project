import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Hooks e Serviços
import { useAuth } from "../context/AuthContext";
import {
  getMyList,
  getMyListIds,
  getPopularMovies,
  searchMovies,
} from "../services/api";

// Componentes
import MovieCard from "../components/MovieCard";
import MovieRow from "../components/MovieRow";
import SkeletonCard from "../components/SkeletonCard";

function Home() {
  // Estado para a grade principal (populares/busca)
  const [mainMovies, setMainMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para a "Minha Lista"
  const { currentUser } = useAuth();
  const [myListMovies, setMyListMovies] = useState([]);
  const [myListIds, setMyListIds] = useState(new Set());

  // Função para buscar a lista do usuário (IDs e filmes completos)
  const fetchMyList = useCallback(() => {
    if (currentUser) {
      getMyListIds(currentUser.uid).then(setMyListIds);
      getMyList(currentUser.uid).then(setMyListMovies);
    } else {
      setMyListIds(new Set());
      setMyListMovies([]);
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
    setIsLoading(true);
    const apiCall = searchTerm.trim()
      ? searchMovies(searchTerm, page)
      : getPopularMovies(page);

    apiCall
      .then((newMovies) => {
        setMainMovies((prevMovies) =>
          page === 1 ? newMovies : [...prevMovies, ...newMovies]
        );
        setHasMore(newMovies.length > 0);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [page, searchTerm]);

  // Efeito para resetar a busca
  useEffect(() => {
    setMainMovies([]);
    setPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    const timer = setTimeout(() => {
      setSearchTerm(newSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="main-content">
        {currentUser && myListMovies.length > 0 && (
          <MovieRow
            title="Minha Lista"
            movies={myListMovies}
            myListIds={myListIds}
            onUpdateMyList={fetchMyList}
          />
        )}

        <div className="container">
          <div className="search-section">
            <input
              type="text"
              placeholder="Buscar por um filme..."
              className="search-input"
              onChange={handleSearchChange}
            />
          </div>

          <h2 className="page-title">
            {searchTerm.trim()
              ? `Resultados para "${searchTerm}"`
              : "Populares"}
          </h2>

          <div className="movie-grid">
            {mainMovies.map((movie, index) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="movie-link"
              >
                <motion.div
                  ref={
                    mainMovies.length === index + 1 ? lastMovieElementRef : null
                  }
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
              mainMovies.length === 0 &&
              Array.from({ length: 20 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default Home;
