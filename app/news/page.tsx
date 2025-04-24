"use client";

import { useEffect, useState } from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import { PostCard } from "@/components/post-card";

interface Post {
  id: string;
  title: string;
  content: string;
  cover_url: string;
  created_at: string;
}

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/publisher/news/get-all-news");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error al cargar posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <BarNavigation />
      <div className="flex flex-col items-center min-h-screen px-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#A46C83]">
        <main className="flex flex-col gap-8 items-center sm:items-start bg-[#D9D9D9] w-full h-full p-8 rounded-b-lg shadow-lg max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Noticias publicadas</h1>
          {loading ? (
            <p className="text-[#212121]">Cargando noticias...</p>
          ) : posts.length === 0 ? (
            <p className="text-[#212121]">No hay noticias disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
