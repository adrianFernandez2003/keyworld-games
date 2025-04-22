"use client";
import React from "react";
import Link from "next/link";

interface GameCardProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  platforms: string[];
}

export function GameCard({ id, title, price, image, platforms }: GameCardProps) {
  return (
    <Link
      href={`/single-game/${id}`}
      className="w-24 h-64 md:w-48 md:h-80 bg-gradient-to-b from-[#212121] to-[#181818] rounded-md p-3 flex flex-col items-center"
    >
      <div className="w-full h-3/4">
        <img
          className="object-cover w-full h-full rounded-md"
          src={image || "/img/default-game.jpg"}
          alt={title}
        />
      </div>
      <div className="text-start pt-2 w-full">
        <h2 className="text-sm text-custom-white font-bold truncate">
          {title}
        </h2>
        <p className="text-xs text-custom-white font-medium">${price}</p>
        <p className="text-[10px] text-gray-400">
          {platforms.join(", ")}
        </p>
      </div>
    </Link>
  );
}
