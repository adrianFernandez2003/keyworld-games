"use client";
import React from "react";

interface Order {
  code: string;
  platform: string;
  is_redeemed: boolean;
  game: {
    title: string;
    price: number;
  };
}

const UserOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg font-semibold">Code: {order.code}</p>
              <p>Platform: {order.platform}</p>
              <p>Game: {order.game?.title || "N/A"}</p>
              <p>Price: ${order.game?.price?.toFixed(2) || "0.00"}</p>
              <p>Status: {order.is_redeemed ? "✅ Redeemed" : "❌ Not Redeemed"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
