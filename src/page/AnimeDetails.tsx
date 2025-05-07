import { Button } from "@/components";
import { AnimeDetailsSkeleton } from "@/components";
import { Anime, getAnimeDetails } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Info, AlertTriangle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError("");
      try {
        const animeId = parseInt(id, 10);
        const response = await getAnimeDetails(animeId);
        setAnime(response.data);
      } catch (err) {
        setError("Failed to fetch anime details. Please try again.");
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchAnimeDetails();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return <AnimeDetailsSkeleton />;
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <div className="flex h-screen flex-col items-center justify-center gap-6 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-red-500/20 p-6"
          >
            <AlertTriangle className="h-12 w-12 text-[#E50914]" />
          </motion.div>
          <h1 className="text-2xl font-bold">{error || "Anime not found"}</h1>
          <Link to="/">
            <Button
              className="mt-4 bg-[#E50914] px-6 py-3 hover:bg-[#B81D24]"
              onClick={() => {
                sessionStorage.removeItem("scrollPosition");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getGenreColors = (index: number) => {
    const colors = ["#B81D24", "#E50914", "#831010", "#C11119"];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-black/40" />

        <header className="absolute top-0 right-0 left-0 z-10">
          <div className="container mx-auto flex items-center gap-4 px-4 py-4 md:px-16">
            <Link
              to="/"
              onClick={() => {
                const savedScrollPosition = sessionStorage.getItem("scrollPosition");
                if (savedScrollPosition) {
                  setTimeout(() => {
                    window.scrollTo({
                      top: parseInt(savedScrollPosition, 10),
                      behavior: "auto",
                    });
                  }, 100);
                }
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
            </Link>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link to="/">
                <span className="text-xl font-bold text-[#E50914]">AnimeDB</span>
              </Link>
            </motion.div>
          </div>
        </header>

        <div className="absolute right-0 bottom-0 left-0 p-4 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-1 text-2xl font-bold md:text-4xl lg:text-5xl">{anime.title}</h1>

            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="mb-2 text-xl text-gray-300 md:text-2xl">{anime.title_english}</h2>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[#E50914]">
                {anime.score ? anime.score.toFixed(1) : "N/A"} Rating
              </span>
              <span>{anime.year || "Unknown"}</span>
              <span>{anime.episodes ? `${anime.episodes} Episodes` : ""}</span>
              <span>{anime.rating || ""}</span>
            </div>

            {anime.trailer.youtube_id && (
              <motion.div whileHover={{ scale: 1.03 }} className="mb-6 flex gap-3">
                <a
                  href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-white px-5 py-2 font-bold text-black hover:bg-gray-200"
                >
                  <Play className="h-5 w-5 fill-current" /> Play Trailer
                </a>

                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-gray-600/30 px-5 py-2 font-bold text-white hover:bg-gray-600/50"
                >
                  <Info className="h-5 w-5" /> More Info
                </a>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl text-base md:text-lg"
            >
              {anime.synopsis?.split(" ").slice(0, 50).join(" ")}...
            </motion.p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:px-16">
        <motion.div variants={container} initial="hidden" animate="show" className="mt-4 md:mt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <motion.div variants={item} className="md:col-span-3">
              <section className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-white">About {anime.title}</h2>
                <div className="mb-6 text-gray-300">{anime.synopsis}</div>

                <div className="mb-4">
                  <span className="mb-2 text-sm text-gray-400">Genres: </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {anime.genres.map((genre, index) => (
                      <span
                        key={genre.mal_id}
                        className="rounded px-3 py-1 text-sm"
                        style={{ backgroundColor: getGenreColors(index) }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {anime.trailer.youtube_id && (
                <motion.section variants={item} className="mb-10">
                  <h2 className="mb-4 text-xl font-bold text-white">Trailer</h2>
                  <div className="mx-auto max-w-3xl overflow-hidden rounded-md shadow-lg shadow-black/30">
                    <div className="relative h-0 pb-[56.25%]">
                      <iframe
                        src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                        title={`${anime.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      ></iframe>
                    </div>
                  </div>
                </motion.section>
              )}
            </motion.div>

            <motion.div variants={item} className="md:col-span-1">
              <div className="rounded-md border border-gray-800 bg-black/20 p-5">
                <h3 className="mb-4 font-medium text-gray-300">Details</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Status: </span>
                    <span className="text-white">{anime.status}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">Aired: </span>
                    <span className="text-white">{anime.aired.string}</span>
                  </div>

                  {anime.studios && anime.studios.length > 0 && (
                    <div>
                      <span className="text-gray-400">Studios: </span>
                      <span className="text-white">
                        {anime.studios.map((s) => s.name).join(", ")}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-400">Source: </span>
                    <span className="text-white">{anime.source}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">Episodes: </span>
                    <span className="text-white">{anime.episodes || "Unknown"}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="text-white">{anime.duration}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">Rating: </span>
                    <span className="text-white">{anime.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-gray-800/50 p-3 text-center">
                    <div className="text-sm text-gray-400">Score</div>
                    <div className="text-lg font-bold text-[#E50914]">{anime.score || "N/A"}</div>
                  </div>

                  <div className="rounded-md bg-gray-800/50 p-3 text-center">
                    <div className="text-sm text-gray-400">Rank</div>
                    <div className="text-lg font-bold text-white">#{anime.rank || "N/A"}</div>
                  </div>

                  <div className="rounded-md bg-gray-800/50 p-3 text-center">
                    <div className="text-sm text-gray-400">Popularity</div>
                    <div className="text-lg font-bold text-white">#{anime.popularity || "N/A"}</div>
                  </div>

                  <div className="rounded-md bg-gray-800/50 p-3 text-center">
                    <div className="text-sm text-gray-400">Members</div>
                    <div className="text-lg font-bold text-white">
                      {anime.members
                        ? anime.members > 999999
                          ? `${(anime.members / 1000000).toFixed(1)}M`
                          : `${(anime.members / 1000).toFixed(0)}K`
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {anime.url && (
                  <div className="mt-5">
                    <a
                      href={anime.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E50914] py-2 text-sm font-medium text-white hover:bg-[#B81D24]"
                    >
                      <ExternalLink className="h-4 w-4" /> View on MyAnimeList
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
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
