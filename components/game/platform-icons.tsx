"use client";

import { JSX } from "react";
import { BsNintendoSwitch } from "react-icons/bs";
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { GiPc } from "react-icons/gi";

interface PlatformIconsProps {
  platforms: string[];
}

export const PlatformIcons = ({ platforms }: PlatformIconsProps): JSX.Element => {
  const iconMap: Record<string, JSX.Element> = {
    "Playstation": <FaPlaystation className="w-5 h-5 text-[#C890A7]" />,
    "Xbox": <FaXbox className="w-5 h-5 text-[#C890A7]" />,
    "Switch": <BsNintendoSwitch className="w-5 h-5 text-[#C890A7]" />,
    "PC": <FaSteam className="w-5 h-5 text-[#C890A7]" />,
  };

  return (
    <div className="flex gap-2 mt-2">
      {platforms.map((platform) => (
        <span key={platform} title={platform}>
          {iconMap[platform] || null}
        </span>
      ))}
    </div>
  );
};
