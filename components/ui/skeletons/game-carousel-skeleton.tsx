import { GameCardSkeleton } from "./game-card-skeleton";

interface GameCarouselSkeletonProps {
  title?: string;
  items?: number;
}

export const GameCarouselSkeleton = ({ title = "Games", items = 6 }: GameCarouselSkeletonProps) => {
  return (
    <div className="w-full">
      <p className="mb-2 text-[#212121] text-3xl font-semibold animate-pulse">{title}</p>

      <div className="relative w-full flex items-center">
        <div
          className="inline-grid gap-x-3 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${items}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: items }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
