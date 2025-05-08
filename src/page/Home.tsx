import { AnimeCard, AnimeCardSkeleton, Pagination, SearchInput } from "@/components";
import { Anime, AnimeSearchResult, debounce, searchAnime, getPopularAnime } from "@/utils";
import { motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props extends React.ComponentProps<"div"> {}

export const Home = ({ ...rest }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      setPopularLoading(true);
      try {
        const response = await getPopularAnime();
        setPopularAnime(response.data);
      } catch (err) {
        console.error("Failed to fetch popular anime:", err);
      } finally {
        setPopularLoading(false);
      }
    };

    fetchPopularAnime();
  }, []);

  const handleSearch = async (query: string, pageNum: number = 1) => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const searchResults: AnimeSearchResult = await searchAnime(query, pageNum);
      setResults(searchResults.data);
      setTotalPages(searchResults.pagination.last_visible_page);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to fetch anime. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce((query: string) => {
    setIsSearching(true);
    handleSearch(query);
  }, 250);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      handleSearch(searchTerm, newPage);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsSearching(false);
    setError("");
  };

  const handleResetPage = () => {
    setSearchTerm("");
    setResults([]);
    setIsSearching(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectSuggestion = (query: string) => {
    setSearchTerm(query);
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white" {...rest}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-gradient-to-b from-black to-transparent px-4 py-3 md:px-16"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" onClick={handleResetPage}>
            <motion.h1
              className="cursor-pointer text-xl font-bold text-[#E50914] transition-transform hover:scale-105 md:text-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AnimeDB
            </motion.h1>
          </Link>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 py-4 md:px-16">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="mb-2 text-4xl font-bold">Discover Anime</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Search for your favorite anime series, movies, and more
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mb-10 w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SearchInput
            placeholder="Search for anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={handleClearSearch}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </motion.div>

        {loading && searchTerm && (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Search Results</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {[...Array(12)].map((_, index) => (
                <AnimeCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-12 text-center text-red-400"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && !error && results.length === 0 && searchTerm && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-12 text-center"
          >
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 text-xl font-semibold">No results found</h3>
            <p className="text-gray-400">Try a different search term or check the spelling</p>
          </motion.div>
        )}

        {!loading && results.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Search Results</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((anime, index) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          </div>
        )}

        {/* Popular Anime Section - Only show when no search is active and no search results */}
        {!searchTerm && results.length === 0 && !loading && (
          <div className="mb-12">
            <div className="mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-[#E50914]" />
              <h2 className="text-xl font-bold">Popular Anime</h2>
            </div>

            {popularLoading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {[...Array(12)].map((_, index) => (
                  <AnimeCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {popularAnime.map((anime, index) => (
                  <AnimeCard key={anime.mal_id} anime={anime} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {!searchTerm && popularAnime.length === 0 && !popularLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E50914]/10">
              <Search className="h-12 w-12 text-[#E50914]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Start your search</h3>
            <p className="mx-auto max-w-md text-gray-400">
              Enter an anime title in the search bar above to begin exploring
            </p>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-800 bg-black/50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} AnimeDB. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/charles5991"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>Built by Charles</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
