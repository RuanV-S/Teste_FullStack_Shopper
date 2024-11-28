"use client";

import Input from "../components/Input";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import LogoDisplay from "../components/LogoDisplay";
import { useRef, useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);

  const toast = useRef<Toast>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      switch (response.status) {
        case 200:
          const user = JSON.stringify(data.user);

          Cookies.set("user", user, { expires: 1 });
          router.push("/home");
          break;
        case 404:
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Nenhum usuário encontrado com este e-mail.",
            life: 3000,
          });

          break;
        case 401:
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "E-mail ou senha incorretos.",
            life: 3000,
          });

          break;
        case 400:
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Os campos de e-mail e senha são obrigatórios.",
            life: 3000,
          });
          break;
        default:
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail:
              "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
            life: 3000,
          });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail:
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex items-center bg-slate-600 justify-center min-h-screen">
      <Toast ref={toast} />

      <div className="bg-neutral-700 p-8 rounded-lg m-4 shadow-lg w-full max-w-md">
        <div className="flex justify-center">
          <LogoDisplay />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100"
            >
              Email <span className="text-red-800">*</span>
            </label>
            <Input
              type="email"
              id="email"
              placeholder="seu@email.com"
              {...register("email", {
                required: "Email é obrigatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email inválido",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100"
            >
              Senha <span className="text-red-800">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Sua senha"
                {...register("password", {
                  required: "Senha é obrigatorio",
                })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? "👁️" : "🙈"}{" "}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-800">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Button type="submit">Entrar</Button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <span className="text-sm text-gray-100">
            Não possui conta?{" "}
            <a href="/cadastrar" className="text-yellow-400">
              Criar uma conta
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
