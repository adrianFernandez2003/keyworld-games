"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";
import UserSideBar from "@/components/user-side-bar";
import { publisherLinks } from "@/lib/constants";

const NewGamePage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [platforms, setPlatforms] = useState<{ id: string; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [genreId, setGenreId] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const res = await fetch("/api/platforms");
      const data = await res.json();
      setPlatforms(data);
    };

    const fetchGenres = async () => {
      const res = await fetch("/api/genres");
      const data = await res.json();
      setGenres(data);
    };

    fetchPlatforms();
    fetchGenres();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("genre_id", genreId);
      if (mainImage) formData.append("main_image", mainImage);
      galleryImages.forEach((file) => formData.append("gallery_images", file));
      selectedPlatforms.forEach((p) => formData.append("platforms", p));

      const res = await fetch("/api/publisher/games", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al crear el juego:", errorData.message);
        return;
      }

      router.push("/publisher-mode");
    } catch (err) {
      console.error("Error inesperado:", err);
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
          <h1 className="text-2xl font-bold mb-6">Publicar nuevo juego</h1>
          <form className="space-y-4 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
            <input
              name="title"
              type="text"
              placeholder="Título del juego"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción del juego"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Precio"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />

            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              required
            >
              <option value="">Selecciona un género</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            <div>
              <label className="block text-sm font-medium mb-1">Selecciona las plataformas:</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <label key={platform.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                    />
                    <span>{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="block text-sm font-medium mt-4">Imagen de portada:</label>
            <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />

            <label className="block text-sm font-medium mt-4">Galería de imágenes:</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(Array.from(e.target.files || []))} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A35C7A] text-white py-2 rounded hover:bg-[#92486A]"
            >
              {loading ? "Publicando..." : "Publicar juego"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewGamePage;
