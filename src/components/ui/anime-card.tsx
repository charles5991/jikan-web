import { Anime } from "@/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router";

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

export const AnimeCard = ({ anime, index }: AnimeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      className="group relative"
    >
      <Link
        to={`/anime/${anime.mal_id}`}
        className="block h-full transition-all duration-300"
        onClick={(e) => {
          const href = (e.currentTarget as HTMLAnchorElement).href;
          e.preventDefault();

          const element = e.currentTarget.closest(".group") as HTMLElement;
          if (element) {
            element.style.transition = "transform 0.3s ease-out";
            element.style.transform = "scale(0.98)";
          }

          sessionStorage.setItem("scrollPosition", window.scrollY.toString());

          setTimeout(() => {
            window.location.href = href;
          }, 120);
        }}
      >
        <div className="overflow-hidden rounded-md transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,130,0.3)]">
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <motion.div
              className="h-full w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <motion.div
              className="absolute bottom-0 left-0 w-full translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              initial={false}
            >
              <h3 className="line-clamp-1 text-sm font-medium text-white">{anime.title}</h3>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {anime.score > 0 && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-red-500" />
                      <span className="ml-1 text-xs font-medium text-white">
                        {anime.score.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-300">{anime.type || "Unknown"}</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-2 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="line-clamp-1 text-sm font-medium text-white">{anime.title}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-gray-400">{anime.type || "Unknown"}</span>
            {anime.aired.from && (
              <span className="text-xs text-gray-400">
                {new Date(anime.aired.from).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div
        className="pointer-events-none fixed inset-0 z-[-1] bg-cover bg-center opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-[0.07]"
        style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
      />
    </motion.div>
  );
};
