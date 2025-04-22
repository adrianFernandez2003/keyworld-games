"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";

const RegisterPublisherPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRes = await fetch("/api/user");
      const user = await userRes.json();

      await fetch("/api/publishers", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          name: form.name,
          description: form.description,
          website: form.website,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetch("/api/profiles/update-is-publisher", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/publisher-mode");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <BarNavigation />
      <main className="flex-1 bg-gray-100 p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registrarse como editor</h1>
        <form
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            type="text"
            placeholder="Nombre del editor"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="website"
            type="url"
            placeholder="Sitio web (opcional)"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A35C7A] text-white py-2 rounded hover:bg-[#92486A]"
          >
            {loading ? "Registrando..." : "Registrarse como editor"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterPublisherPage;
