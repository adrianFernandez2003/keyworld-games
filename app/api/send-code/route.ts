import { sendCodeEmail } from "@/lib/mailer";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { email, platform_game_id } = await req.json();

  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  const { error } = await supabase.from("game_codes").insert({
    code,
    is_redeemed: false,
    platform_game_id,
  });

  if (error) {
    console.error("Error al insertar código:", error);
    return new Response(JSON.stringify({ message: "Error al guardar código" }), { status: 500 });
  }

  await sendCodeEmail(email, code);

  return new Response(JSON.stringify({ message: "Correo enviado", code }), { status: 200 });
}
