"use client";
import React from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { userLinks } from "@/lib/constants";
import { UserCardSkeleton } from "@/components/ui/skeletons/user-card-skeleton";
import { useUser } from "@/context/user-context";
import Image from "next/image";


const ProfilePage = () => {
  const { user, loading } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <BarNavigation />
      <div className="flex flex-1">
        <UserSideBar links={userLinks} />
        <main className="flex-1 bg-gray-100 p-10">
          {loading || !user ? (
            <UserCardSkeleton />
          ) : (
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
              <div className="flex justify-center mb-4">
                <Image
                  src={user.avatar_url || "https://placecats.com/300/300"}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">
                  {user.name + " " + user.last_name}
                </p>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-500 text-sm">
                  Última actualización:{" "}
                  {new Date(user.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
