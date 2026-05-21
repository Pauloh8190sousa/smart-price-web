import { Navigate } from "react-router-dom";

import { getToken } from "@/lib/auth";

import { LoginForm } from "./login-form";

export function LoginPage() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.12),transparent_45%)]" />

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
        <div className="hidden flex-1 flex-col justify-between bg-muted/40 p-10 lg:flex">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Smart Price</h1>

            <p className="mt-4 max-w-sm text-muted-foreground">
              Plataforma inteligente para gerenciamento e análise de preços.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-40 rounded-full bg-muted" />
            <div className="h-3 w-56 rounded-full bg-muted" />
            <div className="h-3 w-32 rounded-full bg-muted" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
