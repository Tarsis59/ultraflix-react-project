import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Serviços e Contexto
import { useAuth } from "../context/AuthContext";
import {
  getMovieDetails,
  getMovieRecommendations,
  getMyListIds,
} from "../services/api";

// Componentes
import CastList from "../components/CastList";
import LazyImage from "../components/LazyImage"; // Importa o LazyImage
import Modal from "../components/Modal";
import MovieRow from "../components/MovieRow";
import ReviewsSection from "../components/ReviewsSection";

function MovieDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  // Estados da página
  const [movieData, setMovieData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [myListIds, setMyListIds] = useState(new Set());
  const [trailerKey, setTrailerKey] = useState(null);
  const [externalLink, setExternalLink] = useState({ url: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar a lista do usuário
  const fetchMyList = useCallback(() => {
    if (currentUser) {
      getMyListIds(currentUser.uid).then(setMyListIds);
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchMyList();

    Promise.all([getMovieDetails(id), getMovieRecommendations(id)])
      .then(([movieDetailsData, recommendationData]) => {
        setMovieData(movieDetailsData);
        setRecommendations(recommendationData);

        const officialTrailer = movieDetailsData.videos?.results?.find(
          (v) => v.type === "Trailer" && v.official
        );
        setTrailerKey(
          officialTrailer?.key ||
            movieDetailsData.videos?.results?.[0]?.key ||
            null
        );

        const providers = movieDetailsData.watch_providers?.results?.BR;
        const details = movieDetailsData.details;
        if (providers?.link)
          setExternalLink({ url: providers.link, text: "Assistir Agora" });
        else if (details?.homepage && details.homepage.startsWith("http"))
          setExternalLink({ url: details.homepage, text: "Site Oficial" });
        else if (details?.imdb_id)
          setExternalLink({
            url: `https://www.imdb.com/title/${details.imdb_id}`,
            text: "Ver no IMDb",
          });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id, currentUser, fetchMyList]);

  if (isLoading) return <div className="loading-fullscreen"></div>;
  if (!movieData?.details)
    return <p className="error-message">Filme não encontrado.</p>;

  const { details, credits } = movieData;
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : "";
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="page-content"
      >
        <div className="movie-details-hero">
          <div
            className="movie-details-backdrop"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          ></div>
          <div className="movie-details-container">
            <div className="movie-details-content">
              <motion.div
                layoutId={`card-${id}`}
                className="movie-details-poster-wrapper"
              >
                {}
                <LazyImage src={posterUrl} alt={`Pôster de ${details.title}`} />
              </motion.div>
              <motion.div
                className="movie-details-info"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
              >
                <h1>{details.title}</h1>
                {details.tagline && (
                  <p className="tagline">"{details.tagline}"</p>
                )}
                <p>{details.overview}</p>
                <div className="info-section">
                  <h3>Gêneros</h3>
                  <p>{details.genres.map((g) => g.name).join(", ")}</p>
                </div>
                <div className="action-buttons">
                  <Link to="/" className="btn btn-tertiary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5" />
                      <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span>Voltar</span>
                  </Link>
                  {trailerKey && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Ver Trailer</span>
                    </button>
                  )}
                  {externalLink.url && (
                    <a
                      href={externalLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <path d="M15 3h6v6" />
                        <path d="M10 14L21 3" />
                      </svg>
                      <span>{externalLink.text}</span>
                    </a>
                  )}
                </div>
                {credits?.cast && credits.cast.length > 0 && (
                  <CastList cast={credits.cast} />
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="recommendations-container">
          <MovieRow
            title="Recomendações"
            movies={recommendations}
            myListIds={myListIds}
            onUpdateMyList={fetchMyList}
          />
        </div>

        <ReviewsSection movieId={id} />
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="video-responsive">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Trailer do Filme"
          ></iframe>
        </div>
      </Modal>
    </>
  );
}

export default MovieDetails;
