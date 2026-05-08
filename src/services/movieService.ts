import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

interface FetchMoviesParams {
  query: string;
  page: number;
}

export const fetchMovies = async ({
  query,
  page,
}: FetchMoviesParams): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
};

