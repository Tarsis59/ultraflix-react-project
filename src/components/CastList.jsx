import { Link } from "react-router-dom";
import "./CastList.css";
import LazyImage from "./LazyImage";

const placeholderAvatar = "https://placehold.co/200x300/181818/fff?text=?";

function CastList({ cast }) {
  const topCast = cast.slice(0, 10);

  return (
    <div className="cast-section">
      <h3>Elenco Principal</h3>
      <div className="cast-list">
        {topCast.map((person) => (
          <Link
            to={`/person/${person.id}`}
            key={person.cast_id}
            className="cast-member"
          >
            {}
            <LazyImage
              src={
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                  : placeholderAvatar
              }
              alt={person.name}
              className="cast-photo"
            />
            <div className="cast-info">
              <p className="cast-name">{person.name}</p>
              <p className="cast-character">{person.character}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CastList;
