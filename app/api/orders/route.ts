import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(JSON.stringify({ message: "Authentication failed" }), {
        status: 401,
      });
    }

    const { data, error } = await supabase
      .from("game_codes")
      .select(`
        code,
        platform,
        is_redeemed,
        game:game_id (
          title,
          price
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching orders:", error);
      return new Response(JSON.stringify({ message: "Error fetching orders" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
