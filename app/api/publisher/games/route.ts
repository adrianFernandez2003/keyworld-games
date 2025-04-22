import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 });
  }

  const body = await req.json();
  const { title, description, price, platforms } = body;

  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return new Response(JSON.stringify({ message: "No platforms selected" }), { status: 400 });
  }

  const { data: publisher, error: pubError } = await supabase
    .from("publishers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (pubError || !publisher) {
    return new Response(JSON.stringify({ message: "Publisher not found" }), { status: 404 });
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert({
      title,
      description,
      price,
      publisher_id: publisher.id,
    })
    .select("id")
    .single();

  if (gameError || !game) {
    console.error("Game creation error:", gameError);
    return new Response(JSON.stringify({ message: gameError.message }), { status: 500 });
  }

  const platformRelations = platforms.map((platform_id: string) => ({
    platform_id,
    game_id: game.id,
  }));

  const { error: linkError } = await supabase
    .from("platform_game")
    .insert(platformRelations);

  if (linkError) {
    console.error("Error inserting platform relations:", linkError);
    return new Response(JSON.stringify({ message: linkError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Game created" }), { status: 201 });
}


export async function GET() {
    const supabase = await createClient();
  
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 });
    }
  
    const { data: publisher, error: pubError } = await supabase
      .from("publishers")
      .select("id")
      .eq("user_id", user.id)
      .single();
  
    if (pubError || !publisher) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
  
    const { data: games, error } = await supabase
      .from("games")
      .select(`
        id,
        title,
        price,
        created_at,
        platform_game (
          platform:platforms (name)
        )
      `)
      .eq("publisher_id", publisher.id);
  
    if (error) {
      console.error("Error fetching games:", error);
      return new Response(JSON.stringify({ message: "Error fetching games" }), { status: 500 });
    }
  
    return new Response(JSON.stringify(games), { status: 200 });
  }