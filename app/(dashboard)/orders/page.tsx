"use client";

import { useEffect, useState } from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { userLinks } from "@/lib/constants";
import { useUser } from "@/context/user-context";

interface Order {
  code: string;
  is_redeemed: boolean;
  redeemed_at?: string | null;
  created_at: string;
  platform_game: {
    games: {
      title: string;
      price: number;
    };
    platforms: {
      name: string;
    };
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
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          console.warn("Formato inesperado:", data);
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
    await fetch(`/api/redeem/${code}`, { method: "PATCH" });
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
            <p>No tienes pedidos aún.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-[#f4f4f7] text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">FECHA</th>
                    <th className="px-6 py-3">ESTADO</th>
                    <th className="px-6 py-3">TÍTULO</th>
                    <th className="px-6 py-3">CÓDIGO</th>
                    <th className="px-6 py-3">TOTAL</th>
                    <th className="px-6 py-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => {
                    const game = order.platform_game?.games;
                    const platform = order.platform_game?.platforms;
                    const price = game?.price?.toFixed(2) || "0.00";

                    const statusText = order.is_redeemed ? "ENTREGADO" : "PENDIENTE";
                    const statusColor = order.is_redeemed ? "text-emerald-600" : "text-yellow-600";
                    

                    return (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="px-6 py-4">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 font-semibold ${statusColor}`}>
                          {statusText}
                        </td>
                        <td className="px-6 py-4">
                          {game?.title || "N/D"} ({platform?.name || "N/D"})
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {order.is_redeemed ? order.code : "••••••••"}
                        </td>
                        <td className="px-6 py-4">MX${price}</td>
                        <td className="px-6 py-4 text-right space-x-2">
  {!order.is_redeemed && order.redeemed_at == null && (
    <button
      onClick={() => redeemCode(order.code)}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    >
      Canjear
    </button>
  )}
</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
