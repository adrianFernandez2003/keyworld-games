
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("genres").select("id, name").order("name");
  
    if (error) {
      console.error("❌ Error al obtener géneros:", error.message);
      return new Response(JSON.stringify({ error: "No se pudieron cargar los géneros" }), {
        status: 500,
      });
    }
  
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  