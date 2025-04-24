import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!(file instanceof Blob) || typeof userId !== "string") {
      return new Response(JSON.stringify({ error: "Archivo o ID inválido" }), { status: 400 });
    }

    const supabase = await createClient();

    const ext = (file as File).type.split("/").pop() || "jpg";
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Error al subir avatar:", uploadError.message);
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      return new Response(JSON.stringify({ error: "No se pudo obtener URL pública" }), { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error al actualizar perfil:", updateError.message);
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Error general en subida:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
