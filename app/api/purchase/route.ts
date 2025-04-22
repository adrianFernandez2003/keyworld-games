import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const session = (await supabase.auth.getUser()).data.user;

  if (!session) {
    return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
  }

  const { platform_game_id } = await req.json();
  const code = generateCode();

  const { error } = await supabase.from("game_codes").insert({
    user_id: session.id,
    code,
    is_redeemed: false,
    platform_game_id,
  });

  if (error) {
    console.error("Error saving code:", error);
    return new Response(JSON.stringify({ message: "Error al guardar el código" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Código registrado", code }), { status: 200 });
}

function generateCode() {
  return Array.from({ length: 2 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  ).join("");
}
