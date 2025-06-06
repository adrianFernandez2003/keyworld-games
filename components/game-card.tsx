"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface GameCardProps {
  id: string;
  title: string;
  price: number;
  platforms: string[];
  images?: { url: string; alt?: string; main: boolean }[];
}

export function GameCard({ id, title, price, platforms, images }: GameCardProps) {
  const mainImage = images?.find(img => img.main)?.url || "/Image/default-game.jpg";

  return (
    <Link
      href={`/single-game/${id}`}
      className="w-24 h-64 md:w-48 md:h-80 bg-gradient-to-b from-[#212121] to-[#181818] rounded-md p-3 flex flex-col items-center"
    >
      <div className="w-full h-3/4">
        <Image
          className="object-cover w-full h-full rounded-md"
          src={mainImage}
          alt={title}
          width={192}
          height={256}
        />
      </div>
      <div className="text-start pt-2 w-full">
        <h2 className="text-sm text-custom-white font-bold truncate">{title}</h2>
        <p className="text-xs text-custom-white font-medium">${price}</p>
        <p className="text-[10px] text-gray-400">{platforms.join(", ")}</p>
      </div>
    </Link>
  );
}
