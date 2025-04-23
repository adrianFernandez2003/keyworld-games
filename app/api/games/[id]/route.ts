import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // Extraer ID desde la URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Último segmento es el ID

  if (!id) {
    return new Response(JSON.stringify({ message: "ID no proporcionado" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("games")
    .select(`
      id,
      title,
      description,
      price,
      genre_id,
      publisher_id,
      images,
      platform_game (
        platform_id,
        platform:platforms (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching game by ID:", error);
    return new Response(JSON.stringify(null), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
