// keyworld-games/lib/reward-api.ts
import { toast } from "react-toastify";

export async function sendScore(score: number) {
  try {
    const res = await fetch("/api/tetris/reward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Puntos actualizados");
    } else {
      toast.info(data.message || "No se otorgaron puntos");
    }
  } catch (err) {
    console.error("Error al enviar score al backend:", err);
    toast.error("Error al registrar tus puntos");
  }
}
