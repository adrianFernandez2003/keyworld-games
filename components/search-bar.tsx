"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar juegos...",
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-md bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#A35C7A]"
      />
      <button type="submit" className="absolute right-2 top-2 text-white">
        <Search size={20} />
      </button>
    </form>
  );
};
