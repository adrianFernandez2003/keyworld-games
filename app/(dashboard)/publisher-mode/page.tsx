"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { publisherLinks } from "@/lib/constants";
import { GameCard } from "@/components/game-card";
import { GameCardSkeleton } from "@/components/ui/skeletons/game-card-skeleton";
import { PublisherHeaderSkeleton } from "@/components/ui/skeletons/publisher-header-skeleton";

interface Editor {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
}

interface Game {
  id: string;
  title: string;
  price: number;
  created_at: string;
  images?: { url: string; alt?: string; main: boolean }[];
  platform_game: {
    platform: {
      name: string;
    };
  }[];
}

const EditorDashboardPage = () => {
  const router = useRouter();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/user");
        const user = await userRes.json();

        if (!user.is_publisher) {
          router.push("/publisher-program");
          return;
        }

        const editorRes = await fetch("/api/publisher");
        const editorData = await editorRes.json();
        setEditor(editorData);

        const gamesRes = await fetch("/api/publisher/games/get-games");
        const contentType = gamesRes.headers.get("content-type") || "";
        if (!gamesRes.ok || !contentType.includes("application/json")) {
          throw new Error("Respuesta inválida al obtener juegos");
        }

        const gamesData = await gamesRes.json();
        setGames(gamesData);
      } catch (error) {
        console.error("Error al cargar el panel del editor:", error);
      }
    };

    fetchData();
  }, [router]);

  const isLoading = !editor || games === null;

  return (
    <div className="flex flex-col min-h-screen">
      <BarNavigation />
      <div className="flex flex-1">
        <UserSideBar links={publisherLinks} />
        <main className="flex-1 bg-gray-100 p-10">
          {isLoading ? (
            <>
              <PublisherHeaderSkeleton />
            </>
          ) : (
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {editor!.name}!</h1>
              <p className="text-gray-700">{editor!.description}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Juegos publicados</h2>
            <button
              onClick={() => router.push("/publisher-mode/new")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Publicar nuevo juego
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <GameCardSkeleton key={idx} />
              ))}
            </div>
          ) : games!.length === 0 ? (
            <p>Aún no has publicado ningún juego.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {games!.map((game) => {
                const mainImage =
                  game.images?.find((img) => img.main) || {
                    url: "/img/rdr2.avif",
                    alt: game.title,
                    main: true,
                  };

                return (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    price={game.price}
                    platforms={game.platform_game.map((pg) => pg.platform.name)}
                    images={[mainImage]}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorDashboardPage;
