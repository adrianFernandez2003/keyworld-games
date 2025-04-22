import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { code: string } }) {
  const supabase = await createClient();
  const { code } = params;

  const { error } = await supabase
    .from("game_codes")
    .update({ user_id: null })
    .eq("code", code);

  if (error) {
    console.error("Error al reembolsar:", error);
    return new Response(JSON.stringify({ message: "Error al reembolsar" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Código reembolsado" }), { status: 200 });
}
