import { createClient } from "@/utils/supabase/server";

interface GameImage {
  url: string;
  alt?: string;
  main: boolean;
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  let query = supabase
    .from("games")
    .select(`
      id,
      title,
      price,
      images,
      platform_game (
        platform:platforms (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching public games:", error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = data.map((game) => ({
    ...game,
    images: (game.images ?? []).filter((img: GameImage) => img.url && img.main !== undefined),
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
