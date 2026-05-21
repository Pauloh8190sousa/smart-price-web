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

      toast.success(`Bem-vindo, ${response.user.name}!`);

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Erro ao realizar login";

        toast.error(message);

        return;
      }

      toast.error("Erro inesperado");
    }
  }

  return (
    <Card className="w-full max-w-sm border-border/60 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Entrar</CardTitle>

        <p className="text-sm text-muted-foreground">
          Faça login para acessar o Smart Price
        </p>
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={handleLogin}>
          <div className="space-y-4">
            <FormField
              name="email"
              type="email"
              autoComplete="email"
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
