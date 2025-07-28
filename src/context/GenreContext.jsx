import { createContext, useContext, useEffect, useState } from "react";
import { getGenres } from "../services/api";

const GenreContext = createContext();

export function GenreProvider({ children }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres))
      .catch(console.error);
  }, []);

  return (
    <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
}
