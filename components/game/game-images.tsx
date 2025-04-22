"use client";
import Image from "next/image";

interface GameImagesProps {
  images: { url: string; alt?: string }[];
}

export const GameImages = ({ images }: GameImagesProps) => {
  return (
    <div className="flex flex-col gap-2">
      {(images ?? []).map((img, i) => (
        <div key={i} className="w-[70px] h-[70px] overflow-hidden rounded-md">
          <Image
            src={img.url}
            alt={img.alt || "Game image"}
            width={70}
            height={70}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};
