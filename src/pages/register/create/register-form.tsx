import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { register } from "@/services/auth/register";

import { registerSchema, type RegisterSchema } from "./register-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Form } from "@/components/form/form";
import { FormField } from "@/components/form/form-field";
import { FormSubmit } from "@/components/form/form-submit";

export function RegisterForm() {
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleRegister(data: RegisterSchema) {
    try {
      const { confirmPassword, ...request } = data;

      const user = await register(request);

      toast.success("Conta criada com sucesso", {
        description: `Bem-vindo, ${user.name}!`,
      });

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Erro ao criar conta";

        toast.error("Falha no cadastro", {
          description: message,
        });

        return;
      }

      toast.error("Erro inesperado");
    }
  }

  return (
    <Card
      className="
    w-full
    max-w-lg
    rounded-3xl
    border-border/50
    bg-background/80
    shadow-[0_20px_80px_rgba(0,0,0,0.12)]
    backdrop-blur-xl
    animate-in
    fade-in
    zoom-in-95
    duration-500
  "
    >
      <CardHeader className="space-y-4 px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
        <div className="space-y-2">
          <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
            Criar conta
          </CardTitle>

          <p className="text-base leading-relaxed text-muted-foreground">
            Cadastre-se para começar a monitorar preços e receber alertas.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
        <Form form={form} onSubmit={handleRegister}>
          <div className="space-y-6">
            <FormField
              name="name"
              label="Nome"
              autoComplete="name"
              placeholder="Digite seu nome"
              icon={User}
            />

            <FormField
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="Digite seu email"
              icon={Mail}
            />

            <FormField
              name="password"
              type="password"
              label="Senha"
              autoComplete="new-password"
              placeholder="Digite sua senha"
              icon={Lock}
            />

            <FormField
              name="confirmPassword"
              type="password"
              label="Confirmar senha"
              autoComplete="new-password"
              placeholder="Digite sua senha novamente"
              icon={Lock}
            />

            <div className="pt-2">
              <FormSubmit>
                <UserPlus className="size-4" />
                Criar conta
              </FormSubmit>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="
      font-medium
      text-primary
      hover:underline
      cursor-pointer
    "
              >
                Entrar
              </button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
