import MyListButton from "./MyListButton";

function MovieCard({ movie, myListIds, onUpdateMyList }) {
  if (!movie || !movie.id) {
    return null;
  }

  return (
    <div className="movie-card">
      <MyListButton
        movie={movie}
        myListIds={myListIds}
        onUpdate={onUpdateMyList}
      />
      <div
        className="movie-card-image"
        style={{ backgroundImage: `url(${movie.imageUrl})` }}
      ></div>
      <div className="movie-card-content">
        <h3>{movie.title}</h3>
        <p>Nota: {movie.rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;
