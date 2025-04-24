"use client";
import { useState } from "react";
import Image from "next/image";

interface GameImagesProps {
  images: { url: string; alt?: string; main: boolean }[];
}

export const GameImages = ({ images }: GameImagesProps) => {
  const [selected, setSelected] = useState(() => {
    if (!images || images.length === 0) return null;
    const mainImage = images.find((img) => img.main);
    return mainImage || images[0];
  });

  if (!selected) {
    return <p className="text-sm text-gray-600">No hay imágenes disponibles</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(img)}
            className={`w-[70px] h-[70px] rounded-md overflow-hidden border-2 ${
              img.url === selected.url ? "border-[#A35C7A]" : "border-transparent"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || "Miniatura del juego"}
              width={70}
              height={70}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-md">
        <Image
          src={selected.url}
          alt={selected.alt || "Imagen principal"}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 text-sm bg-white/80 px-2 py-1 rounded shadow">
          {images.findIndex((img) => img.url === selected.url) + 1}/{images.length}
        </div>
      </div>
    </div>
  );
};
