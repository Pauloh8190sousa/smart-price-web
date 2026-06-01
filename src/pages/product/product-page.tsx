import {
  ArrowLeft,
  Calendar,
  Pencil,
  Store,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getProductBySlug } from "@/services/product/get-product-by-slug";

import type { PriceHistory } from "@/types/price-history";
import type { ProductPrice } from "@/types/product-price";
import type { ProductPriceStats } from "@/types/product-price-stats";

import { getProductPriceHistory } from "@/services/product/get-product-price-history";
import { getProductPrices } from "@/services/product/get-product-prices";

import { getProductPriceStats } from "@/services/product/get-product-price-stats";
import type { Product } from "@/types/product";

export function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [stats, setStats] = useState<ProductPriceStats | null>(null);

  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!slug) {
          navigate("/dashboard");

          return;
        }

        const data = await getProductBySlug(slug);

        setProduct(data);

        const [pricesData, historyData, statsData] = await Promise.all([
          getProductPrices(data.id),
          getProductPriceHistory(data.id),
          getProductPriceStats(data.id),
        ]);

        setPrices(pricesData);
        setPriceHistory(historyData);
        setStats(statsData);
      } catch {
        toast.error("Erro ao carregar produto");

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-48 animate-pulse rounded bg-muted/70" />

          <div className="mt-6 h-10 w-40 animate-pulse rounded-xl bg-muted/70" />

          <div className="mt-6 grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted/70" />

            <div className="space-y-4">
              <div className="h-8 w-72 animate-pulse rounded bg-muted/70" />

              <div className="h-4 w-40 animate-pulse rounded bg-muted/70" />

              <div className="h-28 w-full animate-pulse rounded-xl bg-muted/70" />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-xl bg-muted/70"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer transition-colors hover:text-foreground"
          >
            Produtos
          </button>

          <span>/</span>

          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer sm:flex-none"
              onClick={() => {
                toast.info(`Editar ${product.name}`);
              }}
            >
              <Pencil className="size-4" />
              Editar
            </Button>

            <Button
              variant="destructive"
              className="flex-1 cursor-pointer sm:flex-none"
              onClick={() => {
                toast.warning(`Excluir ${product.name}`);
              }}
            >
              <Trash2 className="size-4" />
              Excluir
            </Button>

            <Button
              className="flex-1 cursor-pointer sm:flex-none"
              onClick={() =>
                navigate(`/products/${product.slug}/prices/create`)
              }
            >
              Adicionar preço
            </Button>

            <Button
              className="flex-1 cursor-pointer sm:flex-none"
              onClick={() =>
                navigate(`/products/${product.slug}/alerts/create`)
              }
            >
              Criar alerta
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <Card className="self-start overflow-hidden border-border/50 bg-card/70 backdrop-blur">
            <CardContent className="p-0">
              <div className="aspect-square bg-muted/30">
                <img
                  src={product.imageUrl || "/placeholder-product.png"}
                  alt={product.name}
                  className="h-full w-full object-contain p-6"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-product.png";
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="flex h-full flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.active
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>

                      <span className="rounded-md bg-muted px-2 py-1 text-xs">
                        {product.category}
                      </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">
                      {product.name}
                    </h1>

                    <p className="text-muted-foreground">
                      {product.brand} • {product.model}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Tag className="size-4" />
                      Slug
                    </div>

                    <p className="text-sm text-muted-foreground break-all">
                      {product.slug}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Calendar className="size-4" />
                      Criado em
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Descrição</h2>

                  <p className="leading-relaxed text-muted-foreground">
                    {product.description || "Nenhuma descrição cadastrada."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-border/50 p-4 transition-shadow hover:shadow-lg">
                    <p className="text-sm text-muted-foreground">Marca</p>

                    <p className="mt-1 font-medium">{product.brand || "-"}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 p-4 transition-shadow hover:shadow-lg">
                    <p className="text-sm text-muted-foreground">Modelo</p>

                    <p className="mt-1 font-medium">{product.model || "-"}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 p-4 transition-shadow hover:shadow-lg">
                    <p className="text-sm text-muted-foreground">Categoria</p>

                    <p className="mt-1 font-medium">
                      {product.category || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-border/50 bg-card/80 backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Menor preço
                    </span>

                    <TrendingDown className="size-4 text-green-600" />
                  </div>

                  <p className="text-2xl font-bold text-green-600">
                    {Number(stats?.lowestPrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Maior preço
                    </span>

                    <TrendingUp className="size-4 text-red-600" />
                  </div>

                  <p className="text-2xl font-bold text-red-600">
                    {Number(stats?.highestPrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Média</span>

                    <Tag className="size-4 text-primary" />
                  </div>

                  <p className="text-2xl font-bold">
                    {Number(stats?.averagePrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lojas</span>

                    <Store className="size-4 text-primary" />
                  </div>

                  <p className="text-2xl font-bold">
                    {stats?.storesCount || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    Melhores preços encontrados
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Resultados encontrados na web
                  </p>
                </div>

                <div className="space-y-3">
                  {prices.map((price) => (
                    <div
                      key={price.id}
                      className="
        flex flex-col gap-4 rounded-xl border border-border/50
        p-4 transition-shadow hover:shadow-lg
        sm:flex-row sm:items-center sm:justify-between
      "
                    >
                      <div>
                        <p className="font-medium">{price.storeName}</p>

                        <p className="text-sm text-muted-foreground">
                          {price.available ? "Disponível" : "Indisponível"}
                        </p>

                        {price.installmentQuantity > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {price.installmentQuantity}x de{" "}
                            {Number(price.installmentValue).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              },
                            )}
                          </p>
                        )}
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {Number(price.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>

                        <Button
                          size="sm"
                          className="mt-2 cursor-pointer"
                          onClick={() =>
                            window.open(price.productUrl, "_blank")
                          }
                        >
                          Ver oferta
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Histórico de preços</h2>

                  <p className="text-sm text-muted-foreground">
                    Últimas alterações de preço encontradas
                  </p>
                </div>

                <div className="space-y-3">
                  {priceHistory.map((history) => (
                    <div
                      key={history.id}
                      className="
            flex items-center justify-between rounded-xl
            border border-border/50 p-4
          "
                    >
                      <div>
                        <p className="font-medium">{history.storeName}</p>

                        <p className="text-sm text-muted-foreground">
                          {new Date(history.changedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">
                          {Number(history.oldPrice).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>

                        <p className="font-bold text-green-600">
                          {Number(history.newPrice).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
