import { Link } from "react-router-dom"; // Importa o Link
import { useAuth } from "../context/AuthContext";
import "./AuthStatus.css";

function AuthStatus() {
  const { currentUser, loginWithGoogle, logout } = useAuth();

  return (
    <div className="auth-status">
      {currentUser ? (
        <>
          {}
          <Link to="/perfil">
            <img
              src={currentUser.photoURL}
              alt="Foto do perfil"
              className="auth-avatar"
            />
          </Link>
          <button onClick={logout} className="auth-button logout">
            Sair
          </button>
        </>
      ) : (
        <button onClick={loginWithGoogle} className="auth-button login">
          Entrar com o Google
        </button>
      )}
    </div>
  );
}

export default AuthStatus;
