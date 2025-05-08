"use client";

import { useCart } from "@/context/cart-context";
import { BarNavigation } from "@/components/ui/bar-navigation";
import { FaTrash } from "react-icons/fa";
import { PayPalButton } from "@/components/paypal-button";
import { useUser } from "@/context/user-context";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const { items, addItem, removeItem, decreaseItem, totalPrice } = useCart();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const [points, setPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState(true);

  const canPayWithPoints = points >= totalPrice;

  // 🔄 Mueve fetchPoints fuera para poder llamarlo desde otros lugares
  const fetchPoints = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) {
        setPoints(Number(data.points));
        console.log("🔎 Puntos crudos desde backend:", data.points);
      }
    } catch (err) {
      console.error("Error fetching points:", err);
    } finally {
      setLoadingPoints(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [user]);

  const handlePayWithPoints = async () => {
    try {
      const res = await fetch("/api/pay-with-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, items }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Compra realizada con éxito ✅");

        if (data.codes && Array.isArray(data.codes)) {
          const formatted = data.codes.map((code: string) => `🔑 ${code}`).join("\n");
          alert(`Estos son tus códigos:\n\n${formatted}`);
        }

        items.forEach((item) => removeItem(item.id));

        // ✅ Recargar los puntos después de la compra
        fetchPoints();
      } else {
        toast.error(data.message || "Error en la compra");
      }
    } catch (err) {
      console.error("❌ Error en compra:", err);
      toast.error("Error al procesar el pago con puntos.");
    }
  };

  return (
    <div>
      <BarNavigation />

      <div className="min-h-screen bg-[#A46C83] px-4 sm:px-16 py-10 font-[family-name:var(--font-geist-sans)] text-[#212121]">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Método de pago</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <span>PayPal</span>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={selectedPayment === "paypal"}
                  onChange={() => setSelectedPayment("paypal")}
                />
              </label>

              <label className="flex flex-col gap-2 border px-4 py-3 rounded cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span>Puntos de fidelidad</span>
                  <input
                    type="radio"
                    name="payment"
                    value="points"
                    checked={selectedPayment === "points"}
                    onChange={() => setSelectedPayment("points")}
                    disabled={loadingPoints || !canPayWithPoints}
                  />
                </div>
                {user && (
                  <p className="text-sm text-gray-600">
                    {loadingPoints
                      ? "Cargando puntos..."
                      : `Tienes ${points.toFixed(2)} puntos. ${
                          canPayWithPoints
                            ? "Puedes usarlos para pagar."
                            : "No son suficientes para cubrir el total."
                        }`}
                  </p>
                )}
              </label>
            </div>
          </div>

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
                            addItem({
                              id: item.id,
                              title: item.title,
                              price: item.price,
                              image: item.image,
                            })
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

                  {selectedPayment === "paypal" && (
                    <PayPalButton
                      amount={totalPrice}
                      items={items}
                      email={email}
                      isAuthenticated={!!user}
                    />
                  )}

                  {selectedPayment === "points" && (
                    <button
                      disabled={!canPayWithPoints}
                      onClick={handlePayWithPoints}
                      className={`w-full px-6 py-2 rounded font-semibold text-white transition ${
                        canPayWithPoints
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Pagar con puntos
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
