import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Package,
  Pencil,
  Store as StoreIcon,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getStoreById } from "@/services/store/get-store-by-id";

import { getStoreProducts } from "@/services/store/get-store-products";
import type { ProductPrice } from "@/types/product-price";
import type { Store } from "@/types/store";

export function StorePage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<ProductPrice[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStore() {
      try {
        if (!id) {
          navigate("/dashboard");

          return;
        }

        const [storeData, productsData] = await Promise.all([
          getStoreById(id),
          getStoreProducts(id),
        ]);

        setStore(storeData);
        setProducts(productsData);
      } catch {
        toast.error("Erro ao carregar loja");

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadStore();
  }, [id, navigate]);

  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.productId, p])).values(),
  ).sort((a, b) => a.productName.localeCompare(b.productName));

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-48 animate-pulse rounded bg-muted/70" />

          <div className="mt-6 h-10 w-40 animate-pulse rounded-xl bg-muted/70" />

          <div className="mt-6 h-[500px] animate-pulse rounded-2xl bg-muted/70" />
        </div>
      </main>
    );
  }

  if (!store) {
    return null;
  }

  const domain = (() => {
    try {
      return new URL(store.websiteUrl).hostname;
    } catch {
      return store.websiteUrl;
    }
  })();

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate("/stores")}
            className="cursor-pointer transition-colors hover:text-foreground"
          >
            Lojas
          </button>

          <span>/</span>

          <span className="text-foreground">{store.name}</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/stores")}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="cursor-pointer">
              <Pencil className="size-4" />
              Editar
            </Button>

            <Button variant="destructive" className="cursor-pointer">
              <Trash2 className="size-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <Card className="self-start overflow-hidden border-border/50 bg-card/70 backdrop-blur">
            <CardContent className="p-0">
              <div
                className="
                  flex aspect-square items-center justify-center
                  bg-muted/30 p-8
                "
              >
                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <StoreIcon className="size-32 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="flex flex-col gap-6 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        store.active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {store.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight">
                    {store.name}
                  </h1>

                  <p className="text-muted-foreground">
                    Loja monitorada pelo Smart Price
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Globe className="size-4" />
                      Domínio
                    </div>

                    <p className="text-sm text-muted-foreground break-all">
                      {domain}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <StoreIcon className="size-4" />
                      Status
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {store.active ? "Loja ativa" : "Loja inativa"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium">Website</p>

                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex items-center gap-2
                      break-all text-primary
                      hover:underline
                    "
                  >
                    {store.websiteUrl}

                    <ExternalLink className="size-4 shrink-0" />
                  </a>
                </div>

                <div>
                  <Button
                    className="cursor-pointer"
                    onClick={() => window.open(store.websiteUrl, "_blank")}
                  >
                    <ExternalLink className="size-4" />
                    Acessar loja
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Produtos</p>

                  <p className="mt-2 text-2xl font-bold">
                    {uniqueProducts.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Preços</p>

                  <p className="mt-2 text-2xl font-bold">{products.length}</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Status</p>

                  <p className="mt-2 text-2xl font-bold">
                    {store.active ? "Ativa" : "Inativa"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Domínio</p>

                  <p className="mt-2 text-sm font-bold break-all">{domain}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Produtos desta loja</h2>

                  <p className="text-sm text-muted-foreground">
                    Produtos vinculados a esta loja
                  </p>
                </div>

                <div className="space-y-3">
                  {uniqueProducts.length > 0 ? (
                    uniqueProducts.map((product) => (
                      <div
                        key={product.productId}
                        onClick={() =>
                          navigate(`/products/${product.productSlug}`)
                        }
                        className="
          flex items-center justify-between
          rounded-xl border border-border/50 p-4
          transition-all hover:border-primary/40
          hover:shadow-md cursor-pointer
        "
                      >
                        <div>
                          <p className="font-medium">{product.productName}</p>

                          <p className="text-sm text-muted-foreground">
                            Produto monitorado
                          </p>
                        </div>

                        <Package className="size-5 text-muted-foreground" />
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-[200px] items-center justify-center">
                      <div className="text-center">
                        <Package className="mx-auto mb-3 size-10 text-muted-foreground" />

                        <p className="font-medium">Nenhum produto encontrado</p>

                        <p className="text-sm text-muted-foreground">
                          Esta loja ainda não possui produtos vinculados.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
