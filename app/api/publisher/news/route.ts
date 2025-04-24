import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const cover = formData.get("cover") as File;

    if (!title || !content || !cover) {
      return new Response(JSON.stringify({ message: "Faltan datos obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: { user } } = await (await supabase).auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ message: "Usuario no autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: publisher, error: publisherError } = await (await supabase)
      .from("publishers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (publisherError || !publisher) {
      return new Response(JSON.stringify({ message: "No se encontró el publisher" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ext = cover.name.split(".").pop() || "jpg";
    const filename = `news-cover-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error: uploadError } = await (await supabase).storage
      .from("covers")
      .upload(filename, cover, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("❌ Error subiendo portada:", uploadError.message);
      return new Response(JSON.stringify({ message: "Error subiendo imagen" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: urlData } = (await supabase).storage.from("covers").getPublicUrl(filename);
    const cover_url = urlData?.publicUrl || "";

    const { error: insertError } = await (await supabase).from("news").insert({
      title,
      content,
      cover_url,
      publisher_id: publisher.id,
    });

    if (insertError) {
      console.error("❌ Error guardando noticia:", insertError.message);
      return new Response(JSON.stringify({ message: "Error al guardar noticia" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Noticia publicada con éxito" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Error general:", err);
    return new Response(JSON.stringify({ message: "Error inesperado del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
