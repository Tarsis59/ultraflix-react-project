import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// --- FUNÇÕES DA API TMDb ---

const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint) => {
  const finalUrl = `${API_BASE_URL}/${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${API_KEY}`;
  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error("Falha na resposta da rede.");
  return response.json();
};

const formatMovies = (movies) => {
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average.toFixed(1),
    imageUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : "",
  }));
};

export const getPopularMovies = async (page = 1) => {
  const data = await fetchFromTMDB(`movie/popular?language=pt-BR&page=${page}`);
  return formatMovies(data.results);
};

export const searchMovies = async (query, page = 1) => {
  const data = await fetchFromTMDB(
    `search/movie?language=pt-BR&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  return formatMovies(data.results);
};

export const getGenres = async () => {
  return fetchFromTMDB("genre/movie/list?language=pt-BR");
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const data = await fetchFromTMDB(
    `discover/movie?with_genres=${genreId}&language=pt-BR&page=${page}`
  );
  return formatMovies(data.results);
};

export const getMovieDetails = async (id) => {
  const [details, providers, videos, credits] = await Promise.all([
    fetchFromTMDB(`movie/${id}?language=pt-BR`),
    fetchFromTMDB(`movie/${id}/watch/providers`),
    fetchFromTMDB(`movie/${id}/videos`),
    fetchFromTMDB(`movie/${id}/credits?language=pt-BR`),
  ]);
  return { details, watch_providers: providers, videos, credits };
};

export const getPersonDetails = async (personId) => {
  const [details, movieCredits] = await Promise.all([
    fetchFromTMDB(`person/${personId}?language=pt-BR`),
    fetchFromTMDB(`person/${personId}/movie_credits?language=pt-BR`),
  ]);
  return { details, movieCredits };
};

export const getMovieRecommendations = async (movieId) => {
  const data = await fetchFromTMDB(
    `movie/${movieId}/recommendations?language=pt-BR&page=1`
  );
  return formatMovies(data.results);
};

// --- FUNÇÕES DO FIRESTORE (MINHA LISTA) ---

export const addToMyList = async (userId, movie) => {
  const movieRef = doc(db, "users", userId, "my-list", movie.id.toString());
  await setDoc(movieRef, movie);
};

export const removeFromMyList = async (userId, movieId) => {
  const movieRef = doc(db, "users", userId, "my-list", movieId.toString());
  await deleteDoc(movieRef);
};

export const getMyList = async (userId) => {
  const q = query(collection(db, "users", userId, "my-list"));
  const querySnapshot = await getDocs(q);
  const myList = [];
  querySnapshot.forEach((doc) => {
    myList.push(doc.data());
  });
  return myList;
};

export const getMyListIds = async (userId) => {
  const q = query(collection(db, "users", userId, "my-list"));
  const querySnapshot = await getDocs(q);
  const ids = new Set();
  querySnapshot.forEach((doc) => {
    ids.add(doc.id);
  });
  return ids;
};

// --- FUNÇÕES DO FIRESTORE (AVALIAÇÕES) ---

export const submitReview = async (movieId, userId, reviewData) => {
  const reviewRef = doc(db, "movies", movieId.toString(), "reviews", userId);
  await setDoc(reviewRef, {
    ...reviewData,
    movieId: movieId.toString(),
    authorUid: userId,
    timestamp: serverTimestamp(),
  });
};

export const getReviews = async (movieId) => {
  const reviewsCol = collection(db, "movies", movieId.toString(), "reviews");
  const q = query(reviewsCol, orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  const reviews = [];
  querySnapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews;
};

// --- FUNÇÃO PARA O PERFIL DO USUÁRIO ---

export const getUserActivity = async (userId) => {
  const myListPromise = getMyList(userId);

  const reviewsQuery = query(
    collectionGroup(db, "reviews"),
    where("authorUid", "==", userId)
  );
  const reviewsSnapshotPromise = getDocs(reviewsQuery);

  const [myList, reviewsSnapshot] = await Promise.all([
    myListPromise,
    reviewsSnapshotPromise,
  ]);

  const reviews = [];
  reviewsSnapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() });
  });

  return { myList, reviews };
};
