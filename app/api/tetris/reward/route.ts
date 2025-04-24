import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ message: "Usuario no autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { score } = await req.json();
  const today = new Date().toISOString().slice(0, 10); // formato yyyy-mm-dd

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("points, last_reward_date, points_earned_today")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return new Response(JSON.stringify({ message: "Perfil no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isSameDay = profile.last_reward_date === today;
  const earnedPointsRaw = Math.floor(score / 1000) * 0.05;

  if (earnedPointsRaw <= 0) {
    return new Response(JSON.stringify({ message: "Score insuficiente para obtener puntos" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pointsToday = isSameDay ? profile.points_earned_today || 0 : 0;
  const remainingPoints = 1.0 - pointsToday;

  if (remainingPoints <= 0) {
    return new Response(JSON.stringify({ message: "Ya alcanzaste el máximo de puntos diarios (1.0)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const earnedPoints = Math.min(remainingPoints, earnedPointsRaw);
  const newPoints = (profile.points || 0) + earnedPoints;
  const updatedPointsToday = pointsToday + earnedPoints;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      points: newPoints,
      last_reward_date: today,
      points_earned_today: updatedPointsToday
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error actualizando puntos:", updateError);
    return new Response(JSON.stringify({ message: "Error al actualizar puntos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    message: `Has ganado ${earnedPoints.toFixed(2)} puntos`,
    points: newPoints
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
    