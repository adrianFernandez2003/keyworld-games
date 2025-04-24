"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { publisherLinks } from "@/lib/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !cover) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("cover", cover);

    setLoading(true);

    try {
      const res = await fetch("/api/publisher/news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Noticia publicada con éxito");
        router.push("/publisher-mode");
      } else {
        toast.error(data.message || "Error al publicar la noticia");
      }
    } catch (err) {
      toast.error("Error inesperado");
      console.error("❌", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BarNavigation />
      <div className="flex flex-1 bg-gray-100">
        <UserSideBar links={publisherLinks} />
        <main className="flex-1 bg-gray-100 p-10 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Nueva noticia</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Título"
              className="w-full p-2 border border-gray-300 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Contenido"
              className="w-full p-2 border border-gray-300 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setCover(e.target.files?.[0] || null)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A35C7A] text-white py-2 rounded hover:bg-[#92486A] disabled:opacity-60"
            >
              {loading ? "Publicando..." : "Publicar noticia"}
            </button>
          </form>
        </main>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
