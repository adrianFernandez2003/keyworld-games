"use client";
import { useEffect, useState } from "react";
import GameCarousel from "@/components/ui/CardCarousel";
import { BarNavigation } from "@/components/ui/bar-navigation";
import {GameCarouselSkeleton} from "@/components/ui/skeletons/game-carousel-skeleton";

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


export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games");
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setIsReady(true);
      }
    };

    fetchGames();
  }, []);

  return (
    <div>
      <BarNavigation />
      <div className="flex flex-col items-center min-h-screen px-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#A46C83]">

        <main className="flex flex-col gap-8 items-center sm:items-start bg-[#D9D9D9] w h-full p-8 rounded-b-lg shadow-lg">
        {isReady ? (
  <>
    <GameCarousel title="Acción" games={games} />
    <GameCarousel title="Indies" games={games} />
    <GameCarousel title="Lo más vendido" games={games} />
    <GameCarousel title="Aventura" games={games} />
  </>
) : (
  <>
    <GameCarouselSkeleton title="Acción" />
    <GameCarouselSkeleton title="Indies" />
    <GameCarouselSkeleton title="Lo más vendido" />
    <GameCarouselSkeleton title="Aventura" />
  </>
)}

        </main>
      </div>
    </div>
  );
}
