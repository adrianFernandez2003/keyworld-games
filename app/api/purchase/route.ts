import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

function generateCode(): string {
  return Array.from({ length: 2 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  ).join("");
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const session = (await supabase.auth.getUser()).data.user;

  if (!session) {
    return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
  }

  const { items } = await req.json();

  const allCodes = items.flatMap((item: { id: string; quantity: number }) =>
    Array.from({ length: item.quantity }, () => ({
      user_id: session.id,
      code: generateCode(),
      is_redeemed: false,
      platform_game_id: item.id,
    }))
  );

  const { error } = await supabase.from("game_codes").insert(allCodes);

  if (error) {
    console.error("❌ Error guardando códigos:", error);
    return new Response(JSON.stringify({ message: "Error al guardar los códigos" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Códigos registrados" }), { status: 200 });
}
