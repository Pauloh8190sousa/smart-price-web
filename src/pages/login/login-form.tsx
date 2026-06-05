import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { login } from "@/services/auth/login";

import { Lock, Mail } from "lucide-react";
import { loginSchema, type LoginSchema } from "./login-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Form } from "@/components/form/form";
import { FormField } from "@/components/form/form-field";
import { FormSubmit } from "@/components/form/form-submit";

import { saveAuth } from "@/lib/auth";

export function LoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginSchema) {
    try {
      const response = await login(data);

      saveAuth(response);

      toast.success("Login realizado com sucesso", {
        description: `Bem-vindo, ${response.user.name}!`,
      });

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        const status = error.response?.status;

        if (data?.fields?.length) {
          data.fields.forEach(
            (field: { field: keyof LoginSchema; message: string }) => {
              form.setError(field.field, {
                type: "server",
                message: field.message,
              });
            },
          );

          return;
        }

        if (status === 401) {
          toast.error("Credenciais inválidas", {
            description: data?.message,
          });

          return;
        }

        if (status === 403) {
          toast.error("Conta indisponível", {
            description: data?.message,
          });

          return;
        }

        toast.error("Erro", {
          description: data?.message ?? "Erro ao realizar login",
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
        animate-in fade-in zoom-in-95 duration-500
      "
    >
      <CardHeader className="space-y-4 px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
        <div className="space-y-2">
          <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
            Entrar
          </CardTitle>

          <p className="text-base leading-relaxed text-muted-foreground">
            Faça login para acessar sua conta e acompanhar os preços
            monitorados.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
        <Form form={form} onSubmit={handleLogin}>
          <div className="space-y-6">
            <FormField
              name="email"
              type="email"
              autoComplete="username"
              label="Email"
              placeholder="Digite seu email"
              icon={Mail}
            />

            <FormField
              name="password"
              type="password"
              autoComplete="current-password"
              label="Senha"
              placeholder="Digite sua senha"
              icon={Lock}
            />

            <div className="pt-2">
              <FormSubmit>Entrar</FormSubmit>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Não possui uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
      font-medium
      text-primary
      hover:underline
      cursor-pointer
    "
              >
                Criar conta
              </button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
