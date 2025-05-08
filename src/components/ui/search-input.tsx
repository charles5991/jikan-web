import { forwardRef, useState, useEffect, KeyboardEvent } from "react";
import { cn, debounce, getSearchSuggestions, getTrendingSearchTerms, Anime } from "@/utils";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  onSelectSuggestion?: (query: string) => void;
  recentSearches?: string[];
}

const getRecentSearches = (): string[] => {
  try {
    const searches = localStorage.getItem("recentSearches");
    return searches ? JSON.parse(searches) : [];
  } catch (e) {
    console.error("Error retrieving recent searches:", e);
    return [];
  }
};

const addRecentSearch = (query: string) => {
  try {
    const searches = getRecentSearches();
    const newSearches = [query, ...searches.filter((s) => s !== query)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(newSearches));
  } catch (e) {
    console.error("Error saving recent search:", e);
  }
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, onSelectSuggestion, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches] = useState<string[]>(getTrendingSearchTerms());
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
      setRecentSearches(getRecentSearches());
    }, []);

    const fetchSuggestions = async (query: string) => {
      if (query && query.length > 1) {
        setLoading(true);
        try {
          const result = await getSearchSuggestions(query);
          setSuggestions(result.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 150);

    useEffect(() => {
      if (value) {
        debouncedFetchSuggestions(value.toString());
      } else {
        setSuggestions([]);
      }
    }, [value]);

    useEffect(() => {
      if (isFocused && (value || recentSearches.length > 0)) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, [isFocused, value, recentSearches]);

    const handleSelectSuggestion = (suggestion: string) => {
      addRecentSearch(suggestion);
      if (onSelectSuggestion) {
        onSelectSuggestion(suggestion);
      }
      setShowSuggestions(false);
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      setSuggestions([]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const allItems = [
        ...suggestions.map((s) => s.title),
        ...(!value ? [...recentSearches, ...trendingSearches] : []),
      ];

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && allItems[selectedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(allItems[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    return (
      <div className="relative">
        <div
          className={cn(
            "relative flex h-12 w-full items-center overflow-hidden rounded-md border transition-all duration-300",
            isFocused ? "border-[#E50914] bg-black/80" : "border-gray-600 bg-black/40",
            className,
          )}
        >
          <div className="flex items-center px-4">
            <Search
              className={cn(
                "h-5 w-5 transition-colors",
                isFocused ? "text-[#E50914]" : "text-gray-400",
              )}
            />
          </div>

          <input
            type="text"
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay blur to allow clicking suggestion
              setTimeout(() => setIsFocused(false), 150);
            }}
            onKeyDown={handleKeyDown}
            className="h-full w-full flex-1 bg-transparent px-2 text-white placeholder:text-gray-500 focus:outline-none"
            {...props}
          />

          <AnimatePresence>
            {value && value.toString().length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="mr-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Google-like suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (isFocused || showSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border border-gray-700 bg-black/90 py-2 shadow-lg backdrop-blur-lg"
            >
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-white/20 border-t-[#E50914]"
                  />
                </div>
              )}

              {!loading && value && suggestions.length > 0 && (
                <div className="px-1">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.mal_id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-white transition-colors",
                        selectedIndex === index ? "bg-[#E50914]/20" : "hover:bg-white/10",
                      )}
                      onClick={() => handleSelectSuggestion(suggestion.title)}
                    >
                      <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-1 flex-1">{suggestion.title}</span>
                      <Link
                        to={`/anime/${suggestion.mal_id}`}
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {!loading && value && suggestions.length === 0 && value.toString().length > 1 && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  No matches found for "{value}"
                </div>
              )}

              {/* Trending searches section */}
              {(!value || value.toString().length <= 1) && !loading && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="px-1">
                      <div className="mb-1 px-3 py-1 text-xs font-medium text-gray-500">
                        Recent Searches
                      </div>
                      {recentSearches.map((search, index) => (
                        <div
                          key={`recent-${index}`}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-white transition-colors",
                            selectedIndex === index ? "bg-[#E50914]/20" : "hover:bg-white/10",
                          )}
                          onClick={() => handleSelectSuggestion(search)}
                        >
                          <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="flex-1">{search}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 px-1">
                    <div className="mb-1 px-3 py-1 text-xs font-medium text-gray-500">Trending</div>
                    {trendingSearches.map((search, index) => (
                      <div
                        key={`trending-${index}`}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-white transition-colors",
                          selectedIndex === recentSearches.length + index
                            ? "bg-[#E50914]/20"
                            : "hover:bg-white/10",
                        )}
                        onClick={() => handleSelectSuggestion(search)}
                      >
                        <TrendingUp className="h-4 w-4 flex-shrink-0 text-[#E50914]" />
                        <span className="flex-1">{search}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
