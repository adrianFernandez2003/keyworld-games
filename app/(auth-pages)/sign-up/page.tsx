"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupFormFields = {
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

type SignupErrors = Partial<Record<keyof SignupFormFields, string>>;

export default function Signup() {
  const [errors, setErrors] = useState<SignupErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (formData: FormData): boolean => {
    const newErrors: SignupErrors = {};

    const name = formData.get("name")?.toString().trim() || "";
    const last_name = formData.get("last_name")?.toString().trim() || "";
    const username = formData.get("username")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!last_name) newErrors.last_name = "El apellido es obligatorio.";
    if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Formato de correo electrónico inválido.";
    }

    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validate(formData)) return;

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });

      const result: { message?: string } = await res.json();

      if (!res.ok) {
        if (result.message?.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: result.message }));
        } else if (result.message?.toLowerCase().includes("username")) {
          setErrors((prev) => ({ ...prev, username: result.message }));
        } else {
          setSubmissionError(result.message || "Ocurrió un error.");
        }
      } else {
        setSuccessMessage("¡Cuenta creada con éxito!");
        form.reset();
        setErrors({});
        setSubmissionError("");
      }
    } catch (error) {
      console.error(error);
      setSubmissionError("Error del servidor. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#A46C83]">
      <form
        className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center">Registrarse</h1>
        <p className="text-sm text-gray-600 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link className="text-blue-600 underline" href="/sign-in">
            Inicia sesión
          </Link>
        </p>

        {successMessage && (
          <div className="bg-green-100 text-green-800 text-sm p-2 rounded">{successMessage}</div>
        )}

        {submissionError && (
          <div className="bg-red-100 text-red-800 text-sm p-2 rounded">{submissionError}</div>
        )}

        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input name="name" placeholder="Juan" />
          {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="last_name">Apellido</Label>
          <Input name="last_name" placeholder="Pérez" />
          {errors.last_name && <p className="text-red-600 text-xs">{errors.last_name}</p>}
        </div>

        <div>
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input name="username" placeholder="juanperez" />
          {errors.username && <p className="text-red-600 text-xs">{errors.username}</p>}
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input name="email" placeholder="tucorreo@ejemplo.com" />
          {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input type="password" name="password" placeholder="Tu contraseña" />
          {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
        </div>

        <SubmitButton pendingText="Registrando...">Registrarse</SubmitButton>
      </form>
    </div>
  );
}
