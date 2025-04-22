"use client";

interface GameDescriptionProps {
  title: string;
  price: number;
  description: string;
}

export const GameDescription = ({ title, price, description }: GameDescriptionProps) => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-[#212121]">{title}</h1>
    <p className="text-[#A35C7A] text-lg font-semibold">${price} MXN</p>
    <p className="text-sm text-gray-700 leading-snug max-w-xl">
      {description}
    </p>
  </div>
);
