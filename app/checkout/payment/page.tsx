"use client";

import { useCart } from "@/context/cart-context";
import { BarNavigation } from "@/components/ui/bar-navigation";
import { FaTrash } from "react-icons/fa";
import { PayPalButton } from "@/components/paypal-button";
import { useUser } from "@/context/user-context"; 
import { useState } from "react";

export default function CheckoutPage() {
  const { items, addItem, removeItem, decreaseItem, totalPrice } = useCart();
  const { user } = useUser(); 
  const [email, setEmail] = useState("");

  return (
    <div>
      <BarNavigation />

      <div className="min-h-screen bg-[#A46C83] px-4 sm:px-16 py-10 font-[family-name:var(--font-geist-sans)] text-[#212121]">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Métodos de pago */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Método de pago</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <span>Tarjeta de crédito o débito</span>
                <input type="radio" name="payment" />
              </label>
              <label className="flex items-center justify-between border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <span>PayPal</span>
                <input type="radio" name="payment" />
              </label>
              <label className="flex items-center justify-between border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <span>OXXO Pay</span>
                <input type="radio" name="payment" />
              </label>
              <label className="flex items-center justify-between border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <span>BBVA Bancomer</span>
                <input type="radio" name="payment" />
              </label>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Tu carrito</h2>

            {items.length === 0 ? (
              <p className="text-gray-500">Tu carrito está vacío.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => decreaseItem(item.id)}
                          className="bg-gray-200 px-2 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            addItem({ id: item.id, title: item.title, price: item.price, image: item.image })
                          }
                          className="bg-gray-200 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <p className="font-semibold mt-2">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Comisión de servicio:</span>
                <span className="text-sm text-gray-400">--</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>MX${totalPrice.toFixed(2)}</span>
              </div>

              {/* Botón de pago */}
              {items.length > 0 && (
                <div className="mt-6 space-y-4">
                  {!user && (
                    <input
                      type="email"
                      placeholder="Introduce tu correo"
                      className="w-full border rounded p-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}

                  <PayPalButton
                    amount={totalPrice}
                    platformGameId={items[0].id} 
                    email={email}
                    isAuthenticated={!!user}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
