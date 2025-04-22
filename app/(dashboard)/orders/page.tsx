"use client";

import { useEffect, useState } from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { userLinks } from "@/lib/constants";
import { useUser } from "@/context/user-context";

interface Order {
  code: string;
  platform: string;
  is_redeemed: boolean;
  platform_game_id: string;
  game: {
    title: string;
    price: number;
  };
}

const OrdersPage = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders"); // deberías tener este endpoint en `/app/api/orders/route.ts`
        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("Formato inesperado:", data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const redeemCode = async (code: string) => {
    await fetch(`/api/redeem/${code}`, {
      method: "PATCH",
    });
    window.location.reload();
  };

  const refundCode = async (code: string) => {
    await fetch(`/api/refund/${code}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BarNavigation />
      <div className="flex flex-1">
        <UserSideBar links={userLinks} />
        <main className="flex-1 bg-gray-100 p-10">
          <h2 className="text-2xl font-bold mb-6">Mis pedidos</h2>

          {loading ? (
            <p>Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p>Aún no tienes pedidos.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border">
                  <p className="text-lg font-semibold">Código: {order.code}</p>
                  <p>Plataforma: {order.platform}</p>
                  <p>Juego: {order.game?.title || "N/D"}</p>
                  <p>Precio: ${order.game?.price?.toFixed(2) || "0.00"}</p>
                  <p>
                    Estado:{" "}
                    {order.is_redeemed ? "✅ Canjeado" : "❌ No canjeado"}
                  </p>

                  {!order.is_redeemed && (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => redeemCode(order.code)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        Canjear
                      </button>
                      <button
                        onClick={() => refundCode(order.code)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Reembolsar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
