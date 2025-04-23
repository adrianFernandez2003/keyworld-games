import { createClient } from "@/utils/supabase/server";

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
    return new Response(JSON.stringify([]), { status: 200 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
