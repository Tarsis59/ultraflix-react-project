import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addToMyList, removeFromMyList } from "../services/api";
import "./MyListButton.css";

function MyListButton({ movie, myListIds, onUpdate }) {
  const { currentUser } = useAuth();
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    if (currentUser && myListIds) {
      setIsInList(myListIds.has(movie.id.toString()));
    }
  }, [myListIds, movie.id, currentUser]);

  if (!currentUser) {
    return null; // Não mostra o botão se o usuário não estiver logado
  }

  const handleClick = async (e) => {
    e.preventDefault(); // Impede a navegação ao clicar no botão sobre o card
    e.stopPropagation();

    if (isInList) {
      await removeFromMyList(currentUser.uid, movie.id);
    } else {
      await addToMyList(currentUser.uid, movie);
    }
    setIsInList(!isInList); // Atualiza o estado visualmente
    if (onUpdate) onUpdate(); // Avisa o componente pai que a lista mudou
  };

  return (
    <button
      onClick={handleClick}
      className={`my-list-button ${isInList ? "in-list" : ""}`}
    >
      {isInList ? "✓" : "+"}
    </button>
  );
}

export default MyListButton;
