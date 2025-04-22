import { createClient } from "@/utils/supabase/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

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
  .eq("id", params.id)
  .single();


  if (error) {
    console.error("Error fetching game by ID:", error);
    return new Response(JSON.stringify(null), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
