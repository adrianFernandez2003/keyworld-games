"use client";

import Image from "next/image";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  cover_url: string;
  created_at: string;
}

export function PostCard({ title, content, cover_url, created_at }: PostCardProps) {
  const preview = content.length > 100 ? content.slice(0, 100) + "..." : content;
  const date = new Date(created_at).toLocaleDateString();

  return (
    <div className="w-full min-h-[24rem] bg-gradient-to-b from-[#212121] to-[#181818] rounded-md p-4 flex flex-col gap-4 hover:brightness-105 transition">
      <div className="w-full h-64 relative rounded overflow-hidden">
        <Image
          src={cover_url}
          alt={title}
          width={1200}
          height={400}
          className="rounded object-cover w-full h-full"
          quality={95}
          priority
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div>
          <h2 className="text-sm text-custom-white font-bold mb-1 truncate">{title}</h2>
          <p className="text-sm text-custom-white mb-2">{preview}</p>
        </div>
        <p className="text-xs text-gray-400">Publicado el {date}</p>
      </div>
    </div>
  );
}