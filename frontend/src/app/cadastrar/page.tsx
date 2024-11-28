"use client";

import Input from "../components/Input";
import Button from "../components/Button";
import LogoDisplay from "../components/LogoDisplay";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useRef } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
};

export default function Page() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async ({ name, password, email }: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      switch (response.status) {
        case 201:
          toast.current?.show({
            severity: "success",
            summary: "Usuario criado com sucesso!",
            detail: "Será redirecionando para login...",
            life: 1500,
          });

          setTimeout(() => {
            router.push("/login");
          }, 2000);
          break;
        case 409:
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Esse e-mail está em uso",
            life: 3000,
          });

          break;
        default:
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Ocorreu um problema ao realizar cadastro.",
            life: 3000,
          });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu um problema ao realizar cadastro.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex bg-slate-600 items-center justify-center min-h-screen ">
      <Toast ref={toast} />

      <div className="bg-neutral-700 p-8 rounded-lg m-4 shadow-lg w-full max-w-md">
        <div className="flex justify-center">
          <LogoDisplay />
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-100"
            >
              Nome <span className="text-red-800">*</span>
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Seu nome"
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: {
                  value: 2,
                  message: "O nome deve conter no mínimo 2 caracteres",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

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
                required: "Email é obrigatório",
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
              htmlFor="senha"
              className="block text-sm font-medium text-gray-100"
            >
              Senha <span className="text-red-800">*</span>
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Sua senha"
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 8,
                  message: "A senha deve ter no mínimo 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmpassword"
              className="block text-sm font-medium text-gray-100"
            >
              Confirmar Senha <span className="text-red-800">*</span>
            </label>
            <Input
              type="password"
              id="confirmpassword"
              placeholder="Confirme sua senha"
              {...register("confirmpassword", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === watch("password") || "As senhas não coincidem",
              })}
            />
            {errors.confirmpassword && (
              <p className="text-red-500">{errors.confirmpassword.message}</p>
            )}
          </div>

          <div>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <span className="text-sm text-gray-100">
            Já possui uma conta?{" "}
            <a href="/login" className="text-yellow-400">
              Entrar
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
