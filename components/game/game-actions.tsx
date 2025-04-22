"use client";

import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { PlatformIcons } from "@/components/game/platform-icons";
import { useCart } from "@/context/cart-context";

interface Platform {
  id: string;
  name: string;
}

interface GameActionsProps {
  id: string;
  title: string;
  price: number;
  platforms: Platform[];
  image?: string;
}

export const GameActions = ({ id, title, price, platforms, image }: GameActionsProps) => {
  const { addItem } = useCart();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedPlatform) {
      alert("Selecciona una plataforma antes de continuar");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/platform-game?game_id=${id}&platform_id=${selectedPlatform}`);
      const data = await res.json();

      if (!res.ok || !data.platform_game_id) {
        throw new Error(data.error || "No se pudo obtener el ID de plataforma");
      }

      addItem({
        id: data.platform_game_id, // 👈 importante: este es el platform_game_id
        title,
        price,
        image,
      });

      alert("Juego añadido al carrito");
    } catch (err) {
      console.error("❌ Error añadiendo al carrito:", err);
      alert("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            className={`px-3 py-2 rounded border shadow-sm ${
              selectedPlatform === p.id
                ? "bg-[#C890A7] text-white font-semibold"
                : "bg-white text-gray-800"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-[#C890A7] p-3 rounded-md shadow text-[#FBF5E5] disabled:opacity-50"
        >
          <FaShoppingCart className="w-5 h-5" />
        </button>
        <button
          disabled={!selectedPlatform}
          className="bg-[#212121] text-white px-4 py-2 rounded-md shadow font-semibold disabled:opacity-50"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
};
