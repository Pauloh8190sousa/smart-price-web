import { Navigate } from "react-router-dom";

import { getToken } from "@/lib/auth";

import logoWeb from "@/assets/logoWeb.png";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div
        className="
          relative z-10 flex w-full max-w-6xl overflow-hidden
          rounded-3xl border border-border/50
          bg-card/90
          shadow-[0_20px_80px_rgba(0,0,0,0.12)]
          backdrop-blur
          transition-all duration-300
        "
      >
        <div className="hidden flex-1 flex-col justify-center bg-muted/40 p-12 lg:flex">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 scale-125 bg-primary/20 blur-3xl" />

              <img
                src={logoWeb}
                alt="Smart Price"
                className="relative mb-8 h-36 w-auto object-contain"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Encontre os melhores preços da web
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Monitore produtos, compare ofertas e acompanhe preços
                  automaticamente em múltiplas lojas online.
                </p>
              </div>

              <div className="grid gap-3 text-left">
                <div
                  className="
                      rounded-xl
                      border border-border/50
                      bg-background/60
                      p-4
                      backdrop-blur
                      transition-all
                      hover:-translate-y-1 hover:shadow-lg
                      hover:bg-background/80
                      animate-in fade-in slide-in-from-bottom-2 duration-500
                    "
                >
                  <p className="font-medium">Busca automática</p>

                  <p className="text-sm text-muted-foreground">
                    Encontre os menores preços disponíveis em tempo real.
                  </p>
                </div>

                <div
                  className="
                      rounded-xl
                      border border-border/50
                      bg-background/60
                      p-4
                      backdrop-blur
                      transition-all
                      hover:-translate-y-1 hover:shadow-lg
                      hover:bg-background/80
                      animate-in fade-in slide-in-from-bottom-2 duration-700
                    "
                >
                  <p className="font-medium">Monitoramento inteligente</p>

                  <p className="text-sm text-muted-foreground">
                    Acompanhe variações e ofertas de produtos automaticamente.
                  </p>
                </div>

                <div
                  className="
                      rounded-xl
                      border border-border/50
                      bg-background/60
                      p-4
                      backdrop-blur
                      transition-all
                      hover:-translate-y-1 hover:shadow-lg
                      hover:bg-background/80
                      animate-in fade-in slide-in-from-bottom-2 duration-900
                    "
                >
                  <p className="font-medium">Comparação entre lojas</p>

                  <p className="text-sm text-muted-foreground">
                    Compare preços entre diferentes marketplaces e e-commerces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-16">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
