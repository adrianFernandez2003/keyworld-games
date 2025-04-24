"use client";
import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/context/user-context";

export function ProfilePicture() {
  const { user, refreshUser } = useUser();
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    const res = await fetch("/api/profiles/update-image", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      await refreshUser();
    }
  };

  return (
    <div
      className="relative w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={user?.avatar_url || "/images/default-avatar.png"}
        alt="Avatar"
        width={96}
        height={96}
        className="object-cover w-full h-full"
      />
      {hovered && (
        <button
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Pencil className="text-white w-5 h-5" />
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
