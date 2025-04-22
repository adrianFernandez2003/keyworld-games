"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "../game-card";

interface Game {
  id: string;
  title: string;
  price: number;
  image?: string;
  platform_game: {
    platform: {
      name: string;
    };
  }[];
}


interface GameCarouselProps {
  title?: string;
  games: Game[];
}

const GameCarousel: React.FC<GameCarouselProps> = ({ title = "Games", games }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const updateItemsPerPage = () => {
    if (window.innerWidth < 640) {
      setItemsPerPage(3);
    } else if (window.innerWidth < 768) {
      setItemsPerPage(4);
    } else {
      setItemsPerPage(6);
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < games.length) {
      setStartIndex((prev) => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex((prev) => prev - itemsPerPage);
    }
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="w-full">
      <p className="mb-2 text-[#212121] text-3xl font-semibold">{title}</p>

      <div className="relative w-full flex items-center">
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#FBF5E5] p-2 rounded-full shadow-md z-10"
          >
            <ChevronLeft className="text-[#212121] w-6 h-6" />
          </button>
        )}

        <div
          className="inline-grid gap-x-3 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
          }}
        >
          {games
            .slice(startIndex, startIndex + itemsPerPage)
            .map((game) => (
<GameCard
  key={game.id}
  id={game.id}
  title={game.title}
  price={game.price}
  platforms={game.platform_game.map((pg) => pg.platform?.name).filter(Boolean)}

  image={"/img/rdr2.avif"}
/>

            ))}
        </div>

        {startIndex + itemsPerPage < games.length && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#FBF5E5] p-2 rounded-full shadow-md z-10"
          >
            <ChevronRight className="text-[#212121] w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCarousel;
