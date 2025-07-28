import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import MovieRow from "../components/MovieRow";
import { useAuth } from "../context/AuthContext";
import { getMyListIds, getPersonDetails } from "../services/api";

function PersonPage() {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [myListIds, setMyListIds] = useState(new Set());

  const fetchMyList = useCallback(() => {
    if (currentUser) {
      getMyListIds(currentUser.uid).then(setMyListIds);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMyList();
  }, [currentUser, fetchMyList]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    getPersonDetails(personId)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [personId]);

  if (isLoading) return <div className="loading-fullscreen"></div>;
  if (!person) return <p className="error-message">Pessoa não encontrada.</p>;

  const { details, movieCredits } = person;
  const knownForMovies = movieCredits.cast
    .sort((a, b) => b.popularity - a.popularity)
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average.toFixed(1),
      imageUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
    }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="main-content container">
        <div className="person-details-layout">
          <div className="person-sidebar">
            <LazyImage
              src={
                details.profile_path
                  ? `https://image.tmdb.org/t/p/w500${details.profile_path}`
                  : "https://placehold.co/500x750/181818/fff?text=?"
              }
              alt={details.name}
              className="person-photo"
            />
          </div>
          <div className="person-main-content">
            <h1 className="person-name">{details.name}</h1>
            <div className="person-biography">
              <h3>Biografia</h3>
              <p>{details.biography || "Biografia não disponível."}</p>
            </div>
          </div>
        </div>
        <MovieRow
          title="Conhecido(a) por"
          movies={knownForMovies}
          myListIds={myListIds}
          onUpdateMyList={fetchMyList}
        />
      </main>
    </motion.div>
  );
}

export default PersonPage;
