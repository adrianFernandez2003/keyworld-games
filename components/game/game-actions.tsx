"use client";

import { FaShoppingCart } from "react-icons/fa";
import { PlatformIcons } from "@/components/game/platform-icons";
import { useCart } from "@/context/cart-context";

interface GameActionsProps {
  id: string;
  title: string;
  price: number;
  platforms: string[];
  image?: string;
}

export const GameActions = ({ id, title, price, platforms, image }: GameActionsProps) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id, title, price, image });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          className="bg-[#C890A7] p-3 rounded-md shadow text-[#FBF5E5]"
        >
          <FaShoppingCart className="w-5 h-5" />
        </button>
        <button className="bg-[#212121] text-white px-4 py-2 rounded-md shadow font-semibold">
          Comprar ahora
        </button>
      </div>
      <PlatformIcons platforms={platforms} />
    </div>
  );
};
