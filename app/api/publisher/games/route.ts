import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const genre_id = formData.get("genre_id") as string;
    const platforms = formData.getAll("platforms") as string[];

    const mainImage = formData.get("main_image") as File;
    const galleryImages = formData.getAll("gallery_images") as File[];

    if (!title || !description || isNaN(price) || !genre_id || !mainImage) {
      return new Response(
        JSON.stringify({ message: "Datos incompletos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Usuario no autenticado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener publisher_id
    const { data: publisher, error: publisherError } = await supabase
      .from("publishers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (publisherError || !publisher) {
      return new Response(
        JSON.stringify({ message: "No se encontró el publisher" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const uploadImage = async (file: File): Promise<string | null> => {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `game-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("games")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Error subiendo imagen:", uploadError.message);
        return null;
      }

      const { data } = supabase.storage.from("games").getPublicUrl(fileName);
      return data?.publicUrl || null;
    };

    const images: { url: string; alt?: string; main: boolean }[] = [];

    const mainUrl = await uploadImage(mainImage);
    if (mainUrl) {
      images.push({ url: mainUrl, alt: "Imagen de portada", main: true });
    }

    for (const img of galleryImages) {
      const url = await uploadImage(img);
      if (url) {
        images.push({ url, alt: img.name, main: false });
      }
    }

    const { data: newGame, error } = await supabase
      .from("games")
      .insert({
        title,
        description,
        price,
        genre_id,
        publisher_id: publisher.id,
        images,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error al insertar juego:", error.message);
      return new Response(
        JSON.stringify({ message: "Error al guardar el juego" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const platform_id of platforms) {
      await supabase.from("platform_game").insert({
        platform_id,
        game_id: newGame.id,
      });
    }

    return new Response(
      JSON.stringify({ message: "Juego publicado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Error general:", err);
    return new Response(
      JSON.stringify({ message: "Error inesperado del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
