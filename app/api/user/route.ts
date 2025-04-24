
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Authentication error:", authError);
      return new Response(JSON.stringify({ message: "Authentication failed" }), {
        status: 401,
      });
    }

    if (!user) {
      console.log("User not found");
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, username, updated_at, last_name, is_publisher, points")
      .eq("id", user.id)
      .single();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(JSON.stringify({ message: "Error fetching profile" }), {
        status: 500,
      });
    }

    if (data) {
      console.log("User data:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } else {
      console.log("No profile found for user");
      return new Response(JSON.stringify({ message: "No profile found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
