"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";
import GameCarousel from "@/components/ui/CardCarousel";
import { GameCarouselSkeleton } from "@/components/ui/skeletons/game-carousel-skeleton";

interface Game {
  id: string;
  title: string;
  price: number;
  image?: string;
  platform_game: {
    platforms: {
      name: string;
    };
  }[];
}

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [games, setGames] = useState<Game[] | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/games?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setGames([]);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div>
      <BarNavigation />
      <div className="flex flex-col items-center min-h-[130vh] px-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#A46C83]">
        <main className="flex flex-col gap-8 items-center sm:items-start bg-[#D9D9D9] w-full h-full min-h-[700px] p-8 rounded-b-lg shadow-lg max-w-7xl">
          <h1 className="text-3xl font-bold mb-4 text-center sm:text-left">
            Resultados para &quot;{query}&quot;
          </h1>
  
          {!isClientReady || games === null ? (
            <GameCarouselSkeleton />
          ) : games.length === 0 ? (
            <p className="text-gray-600 text-lg">No se encontraron juegos para esta búsqueda.</p>
          ) : (
            <GameCarousel title="" games={games} />
          )}
        </main>
      </div>
    </div>
  );
  
};

export default SearchResultsPage;
