// pages/store/stores-page.tsx

import { Plus, Search, Store as StoreIcon } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getStores } from "@/services/store/get-stores";

import type { Store } from "@/types/store";

import logoWeb from "@/assets/logoWeb.png";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function StoresPage() {
  const navigate = useNavigate();

  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const cardHoverClass = `
  border-border/50
  bg-card
  shadow-sm
  transition-all duration-200
  hover:-translate-y-1
  hover:border-primary/30
  hover:shadow-lg
  cursor-pointer
`;

  useEffect(() => {
    async function loadStores() {
      try {
        const data = await getStores();

        setStores(data);
      } catch {
        toast.error("Erro ao carregar lojas");
      } finally {
        setIsLoading(false);
      }
    }

    loadStores();
  }, []);

  const filteredStores = useMemo(() => {
    const value = search.trim().toLowerCase();

    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(value) ||
        store.websiteUrl.toLowerCase().includes(value),
    );
  }, [stores, search]);

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
            <div className="flex items-center justify-between border-b pb-4 sticky top-0 bg-background z-10">
              <SidebarTrigger className="h-10 w-10 border rounded-md cursor-pointer" />

              <img
                src={logoWeb}
                alt="Smart Price"
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>

                <p className="text-muted-foreground">
                  Gerencie as lojas monitoradas
                </p>
              </div>

              <Button
                className="cursor-pointer"
                onClick={() => navigate("/stores/create")}
              >
                <Plus className="size-4" />
                Nova Loja
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search
                  className="
        absolute left-3 top-1/2
        size-4 -translate-y-1/2
        text-muted-foreground
      "
                />

                <Input
                  placeholder="Buscar loja..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Exibindo {filteredStores.length} de {stores.length} lojas
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <StoreIcon className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de lojas
                    </p>

                    <h3 className="text-3xl font-bold">{stores.length}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="h-32 animate-pulse rounded-xl bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredStores.map((store) => (
                  <Card
                    key={store.id}
                    className={cardHoverClass}
                    onClick={() => navigate(`/stores/${store.id}`)}
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex justify-center">
                        {store.logoUrl ? (
                          <div className="flex h-28 items-center justify-center rounded-lg bg-muted/20 p-2">
                            <img
                              src={store.logoUrl}
                              alt={store.name}
                              className="max-h-24 w-full object-contain"
                            />
                          </div>
                        ) : (
                          <StoreIcon className="size-14 text-muted-foreground" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="line-clamp-2 font-semibold">
                            {store.name}
                          </h3>

                          <Badge
                            variant={store.active ? "success" : "destructive"}
                          >
                            {store.active ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>

                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {store.websiteUrl}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredStores.length === 0 && (
              <Card>
                <CardContent className="flex min-h-[250px] items-center justify-center">
                  <div className="text-center">
                    <StoreIcon className="mx-auto mb-3 size-10 text-muted-foreground" />

                    <p className="font-medium">Nenhuma loja encontrada</p>

                    <p className="text-sm text-muted-foreground">
                      Cadastre uma nova loja para começar.
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
