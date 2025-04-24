"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "./navigation-button";
import { ProfilePicture } from "./profile-picture";
import { SearchBar } from "../search-bar";
import { useUser } from "@/context/user-context";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCart } from "@/context/cart-context";
import Image from "next/image";


export function BarNavigation() {
  const router = useRouter();
  const { user } = useUser();
  const { items, increaseItem, decreaseItem, removeItem, totalPrice } = useCart();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout/payment");
  };

  return (
    <div className="flex flex-row justify-between items-center px-10 bg-[#181818] w-full h-32 relative">
      <div className="flex justify-start gap-10">
        <div className="flex items-center gap-10">
          <button onClick={() => router.push("/")} className="text-white font-semibold text-lg">
            KEYWORLD
          </button>
          <SearchBar />
        </div>
      </div>

      <div className="flex justify-center gap-6 items-center relative">
        <a href="#" className="text-white">favoritos</a>

        <button onClick={toggleCart} className="text-white relative">
          <FaShoppingCart className="w-5 h-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white px-1 rounded-full">
              {items.length}
            </span>
          )}
        </button>

        {isCartOpen && (
          <div className="absolute top-16 right-24 bg-white rounded shadow-lg p-4 w-80 z-50">
            <h3 className="font-semibold text-lg mb-4">Mi carrito</h3>

            {items.length === 0 ? (
              <div className="flex flex-col items-center text-gray-500 text-sm">
                <span className="text-4xl">ℹ️</span>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.title}`} className="flex gap-3 items-center border-b pb-2">
             <Image
  src="/Image/default-game.jpg"
  alt="Juego por defecto"
  width={80}
  height={80}
  className="rounded"
/>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-600">MX${item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => decreaseItem(item.id)} className="px-2 bg-gray-200 rounded">-</button>
                        <span className="text-sm">{item.quantity}</span>
                        <button onClick={() => increaseItem(item.id)} className="px-2 bg-gray-200 rounded">+</button>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 ml-auto">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-2 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">MX${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleViewCart}
                    className="bg-[#212121] text-white py-2 rounded-md text-sm font-semibold"
                  >
                    Ver carrito
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-[#7C4D64] text-white py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    Comprar ahora
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <ProfilePicture key={user?.id || "guest"} />
      </div>

      <div className="absolute top-[6.7rem] w-full px-10 flex justify-evenly">
        <NavigationButton link="#" label="Categorias" />
        <NavigationButton link="/news" label="Noticias" />
        <NavigationButton link="/rewards-and-points" label="Tienda de puntos" />
        <NavigationButton link="#" label="Lo más vendido" />
      </div>
    </div>
  );
}
