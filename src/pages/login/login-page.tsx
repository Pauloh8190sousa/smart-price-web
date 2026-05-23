import { Navigate } from "react-router-dom";

import { getToken } from "@/lib/auth";

import { Package } from "lucide-react";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div
        className="
  relative z-10 flex w-full max-w-5xl overflow-hidden
  rounded-3xl border border-border/50
  bg-card/95 shadow-2xl backdrop-blur
"
      >
        <div className="hidden flex-1 flex-col justify-between bg-muted/40 p-10 lg:flex">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Package className="size-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Smart Price</h1>

                <p className="text-sm text-muted-foreground">
                  Busca inteligente de preços
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Encontre os melhores preços da web
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Monitore produtos, compare ofertas e acompanhe preços
                  automaticamente em múltiplas lojas online.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur">
                  <p className="font-medium">Busca automática</p>

                  <p className="text-sm text-muted-foreground">
                    Encontre os menores preços disponíveis em tempo real.
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur">
                  <p className="font-medium">Monitoramento inteligente</p>

                  <p className="text-sm text-muted-foreground">
                    Acompanhe variações e ofertas de produtos automaticamente.
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur">
                  <p className="font-medium">Comparação entre lojas</p>

                  <p className="text-sm text-muted-foreground">
                    Compare preços entre diferentes marketplaces e e-commerces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-14">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
