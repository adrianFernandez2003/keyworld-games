import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 });
    }

    const body = await req.json();
    const { name, description, website } = body;

    const { error: insertError } = await supabase.from("publishers").insert({
      user_id: user.id,
      name,
      description,
      website,
      is_active: true,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ message: "Failed to create publisher" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Publisher created" }), { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
