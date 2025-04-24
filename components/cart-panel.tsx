"use client";

import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/cart-context";
import Image from "next/image";


export const CartPanel = () => {
  const { items, increaseItem, decreaseItem, removeItem, totalPrice } = useCart();

  return (
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
            <div key={item.id} className="flex gap-3 items-center border-b pb-2">
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
            <button className="bg-[#212121] text-white py-2 rounded-md text-sm font-semibold">
              Ver carrito
            </button>
            <button className="bg-[#7C4D64] text-white py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2">
              <FaShoppingCart />
              Comprar ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
