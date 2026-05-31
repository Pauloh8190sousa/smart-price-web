// pages/store/stores-page.tsx

import {
    ArrowLeft,
    Globe,
    Plus,
    Search,
    Store as StoreIcon,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getStores } from "@/services/store/get-stores";

import type { Store } from "@/types/store";

export function StoresPage() {
  const navigate = useNavigate();

  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <Button onClick={() => navigate("/stores/create")}>
            <Plus className="size-4" />
            Nova Loja
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>

          <p className="text-muted-foreground">Gerencie as lojas monitoradas</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Buscar loja..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <StoreIcon className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total de lojas</p>

                <h3 className="text-2xl font-bold">{filteredStores.length}</h3>
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
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/stores/${store.id}`)}
                className="
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-lg
                "
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div
                      className="
                        flex h-16 w-16 shrink-0 items-center
                        justify-center rounded-xl bg-muted/40
                      "
                    >
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <StoreIcon className="size-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{store.name}</h3>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            store.active
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {store.active ? "Ativa" : "Inativa"}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="size-4" />
                        <span className="line-clamp-1">{store.websiteUrl}</span>
                      </div>
                    </div>
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
  );
}
