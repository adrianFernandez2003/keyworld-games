"use client";
import React from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { userLinks } from "@/lib/constants";

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <BarNavigation />
      <div className="flex flex-1">
        <UserSideBar links={userLinks} />
        <main className="flex-1 bg-gray-100 p-10">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
            <form className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-[#A35C7A] text-white py-2 rounded hover:bg-[#92486A]"
              >
                Actualizar contraseña
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
