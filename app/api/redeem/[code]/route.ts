import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function PATCH(_: NextRequest, { params }: { params: { code: string } }) {
  const supabase = await createClient();
  const { code } = params;

  const { error } = await supabase
    .from("game_codes")
    .update({ is_redeemed: true, redeemed_at: new Date().toISOString() })
    .eq("code", code);

  if (error) {
    console.error("Error canjeando código:", error);
    return new Response(JSON.stringify({ message: "Error al canjear" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Código canjeado" }), { status: 200 });
}
