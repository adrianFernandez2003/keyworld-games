// app/api/redeem/[code]/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: { code: string } }
) {
  const supabase = await createClient();
  const code = context.params.code;

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

  return new Response(JSON.stringify({ message: "Código canjeado" }), { status: 200 });
}
