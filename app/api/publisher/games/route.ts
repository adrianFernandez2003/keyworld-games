import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ message: "Usuario no autenticado" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Obtener el publisher.id vinculado al usuario
  const { data: publisher, error: publisherError } = await supabase
    .from("publishers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (publisherError || !publisher) {
    return new Response(
      JSON.stringify({ message: "No se encontró el publisher" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Obtener juegos del publisher con plataformas, imágenes y género
  const { data: games, error } = await supabase
    .from("games")
    .select(`
      id,
      title,
      price,
      created_at,
      images,
      genre:genre_id (
        name
      ),
      platform_game (
        platform:platforms ( name )
      )
    `)
    .eq("publisher_id", publisher.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error al obtener juegos:", error.message);
    return new Response(
      JSON.stringify({ message: "Error al cargar juegos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(games), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
