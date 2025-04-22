"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { ProfilePictureSkeleton } from "@/components/ui/skeletons/profile-picture-skeleton";

export function ProfilePicture() {
  const { user, loading, updating } = useUser(); 
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  async function handleSignOut() {
    await signOutAction();
  }

  if (loading || updating) {
    return <ProfilePictureSkeleton />; 
  }

  return (
    <div className="relative z-40 flex flex-col items-center">
      {user ? (
        <>
          <div
            className="rounded-full bg-gray-300 w-12 h-12 flex justify-center items-center cursor-pointer"
            onClick={handleToggle}
          >
            <img
              src={user.avatar_url || "https://placecats.com/300/300"}
              alt="Perfil"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <p className="text-sm text-white font-medium mt-1">{user.username}</p>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Mi cuenta
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" className="block px-4 py-2 hover:bg-gray-100">
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    Pedidos
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (user.is_publisher) {
                        router.push("/publisher-mode");
                      } else {
                        router.push("/publisher-program");
                      }
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Modo editor
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex gap-4 text-sm">
          <Link href="/sign-in" className="text-white">
            Iniciar sesión
          </Link>
          <Link href="/sign-up" className="text-white">
            Registrarse
          </Link>
        </div>
      )}
    </div>
  );
}

