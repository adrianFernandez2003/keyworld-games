import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    currentPassword,
    newPassword,
    confirmPassword
  } = await req.json();

  // Validar que se llenen los tres campos
  if (!currentPassword || !newPassword || !confirmPassword) {
    return new Response(JSON.stringify({ message: "Todos los campos son obligatorios" }), {
      status: 400,
    });
  }

  if (newPassword !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Las contraseñas no coinciden" }), {
      status: 400,
    });
  }

  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ message: "No autorizado" }), { status: 401 });
  }

  // Reautenticar usando la contraseña actual
  const { error: signInError } = await (await supabase).auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return new Response(JSON.stringify({ message: "La contraseña actual no es válida" }), {
      status: 401,
    });
  }

  // Cambiar contraseña
  const { error: updateError } = await (await supabase).auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return new Response(JSON.stringify({ message: "Error al actualizar la contraseña" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Contraseña actualizada con éxito" }), {
    status: 200,
  });
}
