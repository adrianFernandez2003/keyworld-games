import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("platforms")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching platforms:", error);
    return new Response(JSON.stringify({ message: "Error fetching platforms" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
