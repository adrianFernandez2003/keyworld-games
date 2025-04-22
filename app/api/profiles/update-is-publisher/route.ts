import { createClient } from "@/utils/supabase/server";

export async function PUT() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ message: "Authentication failed" }), { status: 401 });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_publisher: true })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ message: "Failed to update profile" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Profile updated" }), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
