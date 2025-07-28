import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useAuth } from "../context/AuthContext";
import { getMyList } from "../services/api";

function MyListPage() {
  const { currentUser } = useAuth();
  const [myList, setMyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getMyList(currentUser.uid)
        .then(setMyList)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <main className="main-content container">
        <h2 className="page-title">Minha Lista</h2>
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="main-content container">
        <h2 className="page-title">Minha Lista</h2>
        <p className="error-message">
          Você precisa fazer login para ver sua lista.
        </p>
      </main>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="main-content container">
        <h2 className="page-title">Minha Lista</h2>
        {myList.length > 0 ? (
          <div className="movie-grid">
            {myList.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="movie-link"
              >
                {}
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>
        ) : (
          <p>Sua lista está vazia. Adicione filmes para vê-los aqui!</p>
        )}
      </main>
    </motion.div>
  );
}

export default MyListPage;
