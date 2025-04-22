"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

interface NavigationButtonProps {
  label: string;
  link: string;
}

export function NavigationButton({ label, link }: NavigationButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="bg-[#A35C7A] text-white py-2 px-4 shadow-md"
    >
      <p className="font-bold text-[#FBF5E5]">{label}</p>
    </button>
  );
}
