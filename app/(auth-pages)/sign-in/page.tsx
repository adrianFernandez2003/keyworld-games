"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { signInAction } from "@/app/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormMessage, Message } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function SignIn() {
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    const res = await signInAction(formData);
  
    if (res.status === "error") {
      setMessage({ error: res.message });
      return;
    }
  

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: res.email,
      password: res.password,
    });
  
    if (error) {
      setMessage({ error: "Autenticación fallida en cliente" });
      return;
    }
  

    router.push("/");
  }; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#A46C83]">
      <form
        className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center">Iniciar sesión</h1>
        <p className="text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <Link className="text-blue-600 underline" href="/sign-up">
            Regístrate
          </Link>
        </p>

        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input name="email" type="email" placeholder="tucorreo@ejemplo.com" required />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input type="password" name="password" placeholder="Tu contraseña" required />
        </div>

        <SubmitButton pendingText="Iniciando sesión...">Iniciar sesión</SubmitButton>

        {message && <FormMessage message={message} />}
      </form>
    </div>
  );
}
