export const GameCardSkeleton = () => {
  return (
    <div className="w-24 h-64 md:w-48 md:h-80 bg-gradient-to-b from-[#212121] to-[#181818] rounded-md p-3 flex flex-col items-center animate-pulse">
      <div className="w-full h-3/4 bg-gray-700 rounded-md" />
      <div className="w-full pt-2 space-y-1">
        <div className="h-3 bg-gray-600 rounded w-3/4" />
        <div className="h-3 bg-gray-600 rounded w-1/2" />
        <div className="h-2 bg-gray-500 rounded w-2/3" />
      </div>
    </div>
  );
};
