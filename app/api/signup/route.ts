"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const last_name = formData.get("last_name")?.toString();
  const username = formData.get("username")?.toString();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  if (!email || !password || !name || !last_name || !username) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: existingUsername } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUsername) {
    return NextResponse.json({ message: "Username already exists" }, { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name,
        last_name,
        username,
        avatar_url: "",
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("email")) {
      return NextResponse.json({ message: "Email is already registered" }, { status: 400 });
    }

    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Thanks for signing up! Please check your email." },
    { status: 200 }
  );
}
