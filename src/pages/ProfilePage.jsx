import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserActivity } from "../services/api";
import "./ProfilePage.css";

function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState({ myList: [], reviews: [] });
  const [stats, setStats] = useState({
    listCount: 0,
    reviewCount: 0,
    avgRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getUserActivity(currentUser.uid)
        .then((data) => {
          setActivity(data);
          // Calcula as estatísticas
          const reviewCount = data.reviews.length;
          const totalRating = data.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const avgRating =
            reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
          setStats({
            listCount: data.myList.length,
            reviewCount,
            avgRating,
          });
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      // Se não houver usuário, redireciona para a home após um breve momento
      setTimeout(() => navigate("/"), 1000);
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <p className="loading-message">
        Você precisa estar logado para ver esta página. Redirecionando...
      </p>
    );
  }

  if (isLoading) return <div className="loading-fullscreen"></div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="main-content container"
    >
      <div className="profile-header">
        <img
          src={currentUser.photoURL}
          alt="Foto de perfil"
          className="profile-avatar"
        />
        <h1 className="profile-name">{currentUser.displayName}</h1>
        <p className="profile-email">{currentUser.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h2>{stats.listCount}</h2>
          <p>Filmes na sua lista</p>
        </div>
        <div className="stat-card">
          <h2>{stats.reviewCount}</h2>
          <p>Avaliações feitas</p>
        </div>
        <div className="stat-card">
          <h2>{stats.avgRating} ★</h2>
          <p>Sua nota média</p>
        </div>
      </div>

      <div className="profile-reviews">
        <h2 className="page-title">Suas Avaliações Recentes</h2>
        {activity.reviews.length > 0 ? (
          activity.reviews.map((review) => (
            <div key={review.id} className="profile-review-item">
              <div className="review-stars-display">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "on" : "off"}>
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="review-comment">"{review.comment}"</p>
              <Link
                to={`/movie/${review.movieId}`}
                className="review-movie-link"
              >
                Ver filme
              </Link>
            </div>
          ))
        ) : (
          <p>Você ainda não fez nenhuma avaliação.</p>
        )}
      </div>
    </motion.div>
  );
}

export default ProfilePage;
