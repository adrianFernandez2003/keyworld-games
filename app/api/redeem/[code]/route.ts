import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  // Obtener el código desde la URL (último segmento)
  const url = new URL(req.url);
  const code = url.pathname.split("/").pop();

  if (!code) {
    return new Response(JSON.stringify({ message: "Código no especificado" }), {
      status: 400,
    });
  }

  console.log("🔁 Intentando actualizar código:", code);

  const { error } = await supabase
    .from("game_codes")
    .update({
      is_redeemed: true,
      redeemed_at: new Date().toISOString(),
    })
    .eq("code", code);

  if (error) {
    console.error("❌ Error al actualizar:", error);
    return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Código canjeado" }), {
    status: 200,
  });
}
