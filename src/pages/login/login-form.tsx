import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { login } from "@/services/auth/login";

import { loginSchema, type LoginSchema } from "./login-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Form } from "@/components/form/form";
import { FormField } from "@/components/form/form-field";
import { FormSubmit } from "@/components/form/form-submit";
import { saveToken } from "@/lib/auth";

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

      saveToken(response.token);

      toast.success("Login realizado com sucesso", {
        description: `Bem-vindo, ${response.user.name}!`,
      });

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Erro ao realizar login";

        toast.error("Falha no login", {
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
    flex
    min-h-[400px]
    w-full
    max-w-md
    flex-col
    justify-center
    border-border/50
    bg-card/80
    shadow-xl
    backdrop-blur
  "
    >
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Entrar
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Faça login para acessar sua conta
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center">
        <Form form={form} onSubmit={handleLogin}>
          <div className="space-y-6">
            <FormField
              name="email"
              type="email"
              autoComplete="username"
              label="Email"
              placeholder="Digite seu email"
            />

            <FormField
              name="password"
              type="password"
              autoComplete="current-password"
              label="Senha"
              placeholder="Digite sua senha"
            />

            <FormSubmit>Entrar</FormSubmit>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
