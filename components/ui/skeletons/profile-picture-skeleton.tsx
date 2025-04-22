"use client";
import React from "react";

export function ProfilePictureSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-400" />
      <div className="w-16 h-3 bg-gray-400 rounded" />
    </div>
  );
}
