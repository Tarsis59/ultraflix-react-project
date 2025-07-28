import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReviews, submitReview } from "../services/api";
import "./ReviewsSection.css";
import StarRating from "./StarRating";

function ReviewsSection({ movieId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReviews(movieId)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !currentUser) return;

    const reviewData = {
      rating,
      comment,
      authorName: currentUser.displayName,
      authorPhotoURL: currentUser.photoURL,
    };

    await submitReview(movieId, currentUser.uid, reviewData);
    // Atualiza a lista de reviews instantaneamente
    setReviews([
      { id: currentUser.uid, ...reviewData },
      ...reviews.filter((r) => r.id !== currentUser.uid),
    ]);
    setRating(0);
    setComment("");
  };

  return (
    <div className="reviews-section">
      <h2>Avaliações da Comunidade</h2>
      {currentUser ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h3>Deixe sua avaliação</h3>
          <StarRating rating={rating} onRatingChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escreva um comentário (opcional)..."
            className="comment-textarea"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={rating === 0}
          >
            Enviar Avaliação
          </button>
        </form>
      ) : (
        <p className="login-prompt">Faça login para deixar sua avaliação.</p>
      )}

      <div className="reviews-list">
        {isLoading ? (
          <p>Carregando avaliações...</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <img
                src={review.authorPhotoURL}
                alt={review.authorName}
                className="review-author-photo"
              />
              <div className="review-content">
                <div className="review-header">
                  <strong>{review.authorName}</strong>
                  <div className="review-stars-display">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < review.rating ? "on" : "off"}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
