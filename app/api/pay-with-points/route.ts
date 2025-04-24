import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

function generateCode(): string {
  return Array.from({ length: 2 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  ).join("-");
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
  }

  const { amount, items } = await req.json();

  // Verifica puntos disponibles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return new Response(JSON.stringify({ message: "Perfil no encontrado" }), { status: 404 });
  }

  if (Number(profile.points) < amount) {
    return new Response(JSON.stringify({ message: "Puntos insuficientes" }), { status: 400 });
  }

  // Resta puntos
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ points: Number(profile.points) - amount })
    .eq("id", user.id);

  if (updateError) {
    return new Response(JSON.stringify({ message: "Error al descontar puntos" }), { status: 500 });
  }

  // Generar códigos
  const generatedCodes: { code: string; platform_game_id: string; user_id: string; is_redeemed: boolean }[] = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      generatedCodes.push({
        code: generateCode(),
        platform_game_id: item.id,
        user_id: user.id,
        is_redeemed: true,
      });
    }
  }

  const { error: insertError } = await supabase
    .from("game_codes")
    .insert(generatedCodes);

  if (insertError) {
    console.error("❌ Error guardando códigos:", insertError);
    return new Response(JSON.stringify({ message: "Error al guardar los códigos" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({
    message: "Compra realizada con puntos",
    codes: generatedCodes.map(c => c.code),
  }), { status: 200 });
}
