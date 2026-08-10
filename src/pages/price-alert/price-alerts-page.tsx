// pages/price-alert/price-alerts-page.tsx

import { Bell, Power, Search, Trash2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getUser } from "@/lib/auth";

import { deletePriceAlert } from "@/services/product/delete-price-alert";
import { getPriceAlerts } from "@/services/product/get-price-alerts";
import { togglePriceAlert } from "@/services/product/toggle-price-alert";

import type { PriceAlert } from "@/types/price-alert";

import logoWeb from "@/assets/logoWeb.png";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function PriceAlertsPage() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const cardHoverClass = `
    border-border/50
    bg-card
    shadow-sm
    transition-all duration-200
    hover:-translate-y-1
    hover:border-primary/30
    hover:shadow-lg
  `;

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

    return alerts.filter((alert) => {
      const matchesSearch = alert.productName.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && alert.active) ||
        (statusFilter === "inactive" && !alert.active);

      return matchesSearch && matchesStatus;
    });
  }, [alerts, search, statusFilter]);

  async function handleToggle(id: string) {
    try {
      await togglePriceAlert(id);

      toast.success("Alerta atualizado");

      await loadAlerts();
    } catch {
      toast.error("Erro ao atualizar alerta");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePriceAlert(id);

      toast.success("Alerta removido");

      await loadAlerts();
    } catch {
      toast.error("Erro ao remover alerta");
    }
  }

  function formatPrice(price: number | string) {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="min-h-screen bg-background">
          <section
            className="
            mx-auto
            w-full
            max-w-screen-2xl
            flex flex-col
            gap-6
            px-4
            sm:px-6
            lg:px-8
            py-6
            "
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b pb-4 sticky top-0 bg-background z-10">
              <SidebarTrigger className="h-10 w-10 border rounded-md cursor-pointer" />

              <img
                src={logoWeb}
                alt="Smart Price"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Título */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Alertas de preço
              </h1>

              <p className="text-muted-foreground">
                Gerencie os alertas de preço dos seus produtos
              </p>
            </div>

            {/* Busca + filtro + contador */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
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

                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "all" | "active" | "inactive")
                  }
                >
                  <SelectTrigger
                    size="sm"
                    className="w-full cursor-pointer sm:w-44"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="size-4 text-muted-foreground" />

                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all" className="text-sm">
                      Todos
                    </SelectItem>

                    <SelectItem value="active" className="text-sm">
                      Ativos
                    </SelectItem>

                    <SelectItem value="inactive" className="text-sm">
                      Inativos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Exibindo {filteredAlerts.length} de {alerts.length} alertas
              </p>
            </div>

            {/* Resumo */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Bell className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de alertas
                    </p>

                    <h3 className="text-3xl font-bold">{alerts.length}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="h-40 animate-pulse rounded-xl bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Alertas */
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={cardHoverClass}>
                    <CardContent className="space-y-4 p-5">
                      {/* Produto + status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl bg-primary/10 p-3 text-primary">
                            <Bell className="size-5" />
                          </div>

                          <h3 className="line-clamp-2 font-semibold">
                            {alert.productName}
                          </h3>
                        </div>

                        <Badge
                          variant={alert.active ? "success" : "destructive"}
                        >
                          {alert.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      {/* Preço alvo */}
                      <div className="rounded-xl border bg-primary/5 p-4">
                        <p className="text-xs text-muted-foreground">
                          Preço alvo
                        </p>

                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(alert.targetPrice)}
                        </p>
                      </div>

                      {/* Data */}
                      <p className="text-xs text-muted-foreground">
                        Criado em{" "}
                        {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                      </p>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={alert.active ? "secondary" : "default"}
                          className="flex-1 cursor-pointer"
                          onClick={() => handleToggle(alert.id)}
                        >
                          <Power className="size-4" />

                          {alert.active ? "Desativar" : "Ativar"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 cursor-pointer"
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

            {/* Nenhum resultado */}
            {!isLoading && filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="flex min-h-[250px] items-center justify-center">
                  <div className="text-center">
                    <Bell className="mx-auto mb-3 size-10 text-muted-foreground" />

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
      </SidebarInset>
    </SidebarProvider>
  );
}
