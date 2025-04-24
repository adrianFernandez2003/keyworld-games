"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";
import { GameCarouselSkeleton } from "@/components/ui/skeletons/game-carousel-skeleton";
import GameCarousel from "@/components/ui/CardCarousel";
import { GameImages } from "@/components/game/game-images";
import { GameDescription } from "@/components/game/game-description";
import { GameActions } from "@/components/game/game-actions";
import { GameReviewList } from "@/components/game/game-review-list";

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  genre_id: string;
  publisher_id: string;
  images: { url: string; alt?: string; main: boolean }[];
  platform_game: {
    platform_id: string;
    platform: {
      name: string;
    };
  }[];
}

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [recommended, setRecommended] = useState<Game[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGame = await fetch(`/api/games/${gameId}`);
        const gameData = await resGame.json();
        setGame(gameData);

        const resRecommended = await fetch(`/api/games?recommended=${gameId}`);
        const recData = await resRecommended.json();
        setRecommended(Array.isArray(recData) ? recData : []);
      } catch (err) {
        console.error("Error fetching game info:", err);
      } finally {
        setIsReady(true);
      }
    };

    if (typeof gameId === "string" && gameId.length > 0) {
      fetchData();
    }
  }, [gameId]);

  return (
    <div>
      <BarNavigation />
      <div className="flex flex-col items-center min-h-screen px-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#A46C83]">
        <main className="flex flex-col gap-8 items-center sm:items-start bg-[#D9D9D9] w-full h-full p-8 rounded-b-lg shadow-lg">

          {game && (
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 bg-white p-4 rounded-lg shadow-md w-full">
              <GameImages
  images={(game.images ?? []).map((img, i) => ({
    ...img,
    main: i === 0, // la primera imagen será la portada
  }))}
/>

              <div>
                <GameDescription
                  title={game.title}
                  price={game.price}
                  description={game.description}
                />
                <GameActions
                  id={game.id}
                  title={game.title}
                  price={game.price}
                  platforms={(game.platform_game ?? []).map(pg => ({
                    id: pg.platform_id,
                    name: pg.platform?.name || "Desconocido"
                  }))}
                />
              </div>
            </div>
          )}

          <section className="w-full">
            {!isReady ? (
              <GameCarouselSkeleton title="Recomendados" />
            ) : (
              <GameCarousel title="Recomendados" games={recommended} />
            )}
          </section>

          <section className="w-full">
            <GameReviewList gameId={gameId} />
          </section>
        </main>
      </div>
    </div>
  );
}
