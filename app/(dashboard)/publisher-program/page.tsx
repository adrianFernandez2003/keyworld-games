"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarNavigation } from "@/components/ui/bar-navigation";

const PublisherProgramPage = () => {
  const [isPublisher, setIsPublisher] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setIsPublisher(data.is_publisher);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleClick = () => {
    if (isPublisher) {
      router.push("/publisher-mode");
    } else {
      router.push("/publisher-program/register");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <BarNavigation />

      <main className="flex-1 bg-gray-100 p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Únete al Programa de editores</h1>
        <p className="text-gray-700 mb-6">
          Publica y gestiona tus propios juegos en nuestra plataforma. Obtén acceso a herramientas, estadísticas y visibilidad para tus títulos.
        </p>

        <button
          onClick={handleClick}
          className="bg-[#A35C7A] text-white px-6 py-2 rounded hover:bg-[#92486A]"
        >
          {loading
            ? "Verificando..."
            : isPublisher
            ? "Ir al modo editor"
            : "Unirme como editor"}
        </button>
      </main>
    </div>
  );
};

export default PublisherProgramPage;
