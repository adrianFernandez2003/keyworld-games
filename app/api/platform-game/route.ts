// app/api/platform-game/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const game_id = searchParams.get("game_id");
  const platform_id = searchParams.get("platform_id");

  if (!game_id || !platform_id) {
    return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
      status: 400,
    });
  }

  const { data, error } = await (await supabase)
    .from("platform_game")
    .select("id")
    .eq("game_id", game_id)
    .eq("platform_id", platform_id)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "No se encontró platform_game_id" }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ platform_game_id: data.id }), {
    status: 200,
  });
}
