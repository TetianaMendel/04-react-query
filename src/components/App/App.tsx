import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from './App.module.css'

interface PaginationProps {
  totalPages: number;
  page: number;
  setPage: (nextPage: number) => void;
}

function Pagination({
  totalPages,
  page,
  setPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies({ query, page } ),
    enabled: query.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
};

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && !isLoading && data && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, query, movies.length]);


  return (
    <>
      <Toaster position="top-right" />
      
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          page={page}
          setPage={setPage}
        />
      )}

      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={setSelectedMovie}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

