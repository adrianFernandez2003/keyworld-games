import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: posts, error } = await (await supabase)
    .from("news")
    .select("id, title, content, cover_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error al obtener noticias:", error.message);
    return new Response(JSON.stringify({ message: "Error al cargar noticias" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
