"use client";
import React from "react";

interface GameReviewListProps {
  gameId: string;
}

export const GameReviewList = ({ gameId }: GameReviewListProps) => {
  const reviews = [
    {
      id: 1,
      user: "xXCarlosProXx",
      rating: 4,
      title: "Buen juego, me hizo llorar",
      date: "10/01/2025",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    }
  ];

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">RESEÑAS</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#FFFCF4] rounded shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 items-center">
                <div className="text-[#A35C7A]">
                  {"★".repeat(review.rating)}
                  <span className="text-[#C890A7]">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                <div className="text-[#A35C7A] font-bold">{review.user}</div>
              </div>
              <span className="text-sm text-[#C890A7]">{review.date}</span>
            </div>
            <h3 className="text-md font-semibold text-[#212121]">{review.title}</h3>
            <p className="text-sm text-gray-600 leading-snug">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
