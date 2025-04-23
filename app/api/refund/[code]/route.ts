import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  // Obtener el código desde la URL
  const url = new URL(req.url);
  const code = url.pathname.split("/").pop();

  if (!code) {
    return new Response(JSON.stringify({ message: "Código no especificado" }), {
      status: 400,
    });
  }

  console.log("🧾 Código recibido para reembolso:", code);

  const { data: before } = await supabase
    .from("game_codes")
    .select("user_id, is_redeemed")
    .eq("code", code)
    .maybeSingle();

  console.log("🔎 Antes del update:", before);

  const { error } = await supabase
    .from("game_codes")
    .update({
      user_id: null,
      is_redeemed: false,
      redeemed_at: null,
    })
    .eq("code", code);

  if (error) {
    console.error("❌ Error al reembolsar:", error);
    return new Response(JSON.stringify({ message: "Error al reembolsar" }), {
      status: 500,
    });
  }

  const { data: after } = await supabase
    .from("game_codes")
    .select("user_id, is_redeemed")
    .eq("code", code)
    .maybeSingle();

  console.log("✅ Después del update:", after);

  return new Response(JSON.stringify({ message: "Código reembolsado" }), {
    status: 200,
  });
}
