export const UserCardSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto animate-pulse">
    <div className="flex justify-center mb-4">
      <div className="w-24 h-24 rounded-full bg-gray-300" />
    </div>
    <div className="space-y-2 text-center">
      <div className="h-5 w-3/4 bg-gray-300 rounded mx-auto" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto" />
      <div className="h-3 w-2/3 bg-gray-100 rounded mx-auto" />
    </div>
  </div>
);
