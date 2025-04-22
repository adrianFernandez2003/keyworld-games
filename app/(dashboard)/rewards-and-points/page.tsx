"use client";
import Image from "next/image";
import { BarNavigation } from "@/components/ui/bar-navigation";
import Board from "@/components/ui/tetris/board";
import { useTetris } from "@/components/hooks/useTetris";
import UpcomingBlocks from "@/components/ui/tetris/upcomingBlocks";

export default function RewardsAndPointsPage() {
  const {
    board,
    startGame,
    restartGame,
    togglePause,
    isPlaying,
    isPaused,
    score,
    upcomingBlocks,
  } = useTetris();

  return (
    <div>
      <BarNavigation />
      <div className="flex flex-col items-center min-h-screen px-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#A46C83]">
        <main className="flex flex-col gap-8 items-center sm:items-start bg-[#D9D9D9] w-full h-full p-8 rounded-b-lg shadow-lg max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Tienda de puntos & Recompensas</h1>

          <div className="flex flex-col lg:flex-row gap-10 w-full justify-between">
            <div className="w-full lg:w-1/2 flex justify-center">
              <Board currentBoard={board} />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-center gap-6 min-h-[500px] justify-between">
              <div className="bg-white p-4 rounded-lg shadow-lg w-full text-center">
                <h2 className="text-xl font-semibold text-[#212121]">
                  Puntos actuales: {score}
                </h2>
              </div>

              <UpcomingBlocks upcomingBlocks={upcomingBlocks} />

              <div className="h-[44px] w-full flex justify-center items-center">
                {isPlaying ? (
                  <div className="flex gap-4">
                    <button
                      onClick={togglePause}
                      className={`px-4 py-2 rounded text-white ${
                        isPaused
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {isPaused ? "Reanudar" : "Pausar"}
                    </button>

                    <button
                      onClick={restartGame}
                      className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      Reiniciar
                    </button>
                  </div>
                ) : (
                  <div className="w-[210px] flex justify-center">
                    <button
                      onClick={startGame}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                      Jugar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow w-full text-sm text-[#333]">
            <h3 className="text-lg font-semibold mb-2">Controles del juego:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>←</strong> Mover a la izquierda
              </li>
              <li>
                <strong>→</strong> Mover a la derecha
              </li>
              <li>
                <strong>↑</strong> Rotar la pieza
              </li>
              <li>
                <strong>↓</strong> Acelerar caída
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
