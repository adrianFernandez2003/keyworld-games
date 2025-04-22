"use client";

import { BarNavigation } from "@/components/ui/bar-navigation";
import { useCart } from "@/context/cart-context";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, increaseItem, decreaseItem, removeItem, totalPrice } = useCart();
  const router = useRouter();

  return (
    <div>
      <BarNavigation />

      <div className="min-h-screen bg-[#A46C83] px-4 sm:px-16 py-10 font-[family-name:var(--font-geist-sans)] text-[#212121]">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Mi carrito</h2>

            {items.length === 0 ? (
              <p className="text-gray-600">No has añadido productos aún.</p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.title}`} className="flex items-center justify-between border-b pb-4">
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image || "/img/default-game.jpg"}
                        alt={item.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <div className="flex gap-2 mt-2 items-center">
                          <button
                            onClick={() => decreaseItem(item.id)}
                            className="px-2 rounded bg-gray-200"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseItem(item.id)}
                            className="px-2 rounded bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mb-2"
                      >
                        <FaTrash />
                      </button>
                      <p className="font-semibold">MX${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Resumen</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total de productos:</span>
                <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">MX${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Comisión:</span>
                <span>--</span>
              </div>
            </div>

            <div className="flex justify-between mt-6 text-lg font-bold">
              <span>Total:</span>
              <span>MX${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout/payment")}
              className="mt-6 w-full bg-[#7C4D64] text-white font-semibold py-3 rounded shadow hover:bg-[#6a3c53] transition-all"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
