// pages/price-alert/price-alerts-page.tsx

import { ArrowLeft, Bell, Power, Search, Trash2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getUser } from "@/lib/auth";

import { deletePriceAlert } from "@/services/product/delete-price-alert";
import { getPriceAlerts } from "@/services/product/get-price-alerts";
import { togglePriceAlert } from "@/services/product/toggle-price-alert";

import type { PriceAlert } from "@/types/price-alert";

export function PriceAlertsPage() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadAlerts() {
    try {
      const user = getUser();

      const data = await getPriceAlerts(user.id);

      setAlerts(data);
    } catch {
      toast.error("Erro ao carregar alertas");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    const value = search.trim().toLowerCase();

    return alerts.filter((alert) =>
      alert.productName.toLowerCase().includes(value),
    );
  }, [alerts, search]);

  async function handleToggle(id: string) {
    try {
      await togglePriceAlert(id);

      toast.success("Alerta atualizado");

      loadAlerts();
    } catch {
      toast.error("Erro ao atualizar alerta");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePriceAlert(id);

      toast.success("Alerta removido");

      loadAlerts();
    } catch {
      toast.error("Erro ao remover alerta");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Alertas de preço</h1>

          <p className="text-muted-foreground">
            Gerencie seus alertas cadastrados
          </p>
        </div>

        <div className="relative max-w-md">
          <Search
            className="
              absolute left-3 top-1/2
              size-4 -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            placeholder="Buscar produto..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Bell className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total de alertas
                </p>

                <h3 className="text-2xl font-bold">{filteredAlerts.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="h-40 animate-pulse bg-muted" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="
                  transition-all
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-lg
                "
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{alert.productName}</h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        alert.active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {alert.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Preço alvo</p>

                    <p className="text-2xl font-bold text-primary">
                      {Number(alert.targetPrice).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Criado em{" "}
                    {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleToggle(alert.id)}
                    >
                      <Power className="size-4" />
                      {alert.active ? "Desativar" : "Ativar"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash2 className="size-4" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredAlerts.length === 0 && (
          <Card>
            <CardContent
              className="
                  flex min-h-[250px]
                  items-center justify-center
                "
            >
              <div className="text-center">
                <Bell
                  className="
                      mx-auto mb-3 size-10
                      text-muted-foreground
                    "
                />

                <p className="font-medium">Nenhum alerta encontrado</p>

                <p className="text-sm text-muted-foreground">
                  Crie um alerta em algum produto.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
