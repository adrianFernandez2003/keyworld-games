import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 });
  }

  const { data, error } = await supabase
    .from("publishers")
    .select("id, name, description, avatar_url")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching publisher:", error);
    return new Response(JSON.stringify({ message: "Publisher not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
