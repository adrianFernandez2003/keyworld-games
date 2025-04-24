import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: { user }, error: authError } = await (await supabase).auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
  }

  const { data: publisher, error: publisherError } = await (await supabase)
    .from("publishers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (publisherError || !publisher) {
    return new Response(JSON.stringify({ message: "Publisher no encontrado" }), { status: 403 });
  }

  const { data: posts, error: postsError } = await (await supabase)
    .from("news")
    .select("id, title, content, cover_url, created_at")
    .eq("publisher_id", publisher.id)
    .order("created_at", { ascending: false });

  if (postsError) {
    return new Response(JSON.stringify({ message: "Error al cargar posts" }), { status: 500 });
  }

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
