import {
  ArrowLeft,
  Bell,
  Calendar,
  DollarSign,
  Heart,
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

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { checkFavorite } from "@/services/product/check-favorite";
import { createFavorite } from "@/services/product/create-favorite";
import { deleteFavorite } from "@/services/product/delete-favorite";
import { getProductPriceStats } from "@/services/product/get-product-price-stats";
import type { Product } from "@/types/product";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [stats, setStats] = useState<ProductPriceStats | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const navigate = useNavigate();

  const { slug } = useParams();

  const cardHoverClass = `
  border-border/50
  bg-card
  shadow-sm
  transition-all duration-200
  hover:-translate-y-1
  hover:border-primary/30
  hover:shadow-lg
`;

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!slug) {
          navigate("/dashboard");

          return;
        }

        const data = await getProductBySlug(slug);

        setProduct(data);

        const user = getUser();

        const [pricesData, historyData, statsData, favoriteData] =
          await Promise.all([
            getProductPrices(data.id),
            getProductPriceHistory(data.id),
            getProductPriceStats(data.id),
            user
              ? checkFavorite(user.id, data.id)
              : Promise.resolve({
                  favorited: false,
                  favoriteId: null,
                }),
          ]);

        setPrices(pricesData);
        setPriceHistory(historyData);
        setStats(statsData);

        setFavorited(favoriteData.favorited);
        setFavoriteId(favoriteData.favoriteId);
      } catch {
        toast.error("Erro ao carregar produto");

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug, navigate]);

  async function handleFavorite() {
    try {
      const user = getUser();

      if (!user || !product) {
        return;
      }

      if (favorited && favoriteId) {
        await deleteFavorite(favoriteId);

        setFavorited(false);
        setFavoriteId(null);

        toast.success("Produto removido dos favoritos");
        return;
      }

      const data = {
        userId: user.id,
        productId: product.id,
      };

      const favorite = await createFavorite(data);

      setFavorited(true);
      setFavoriteId(favorite.id);

      toast.success("Produto favoritado");
    } catch {
      toast.error("Erro ao atualizar favorito");
    }
  }

  const sortedHistory = priceHistory
    .slice()
    .sort(
      (a, b) =>
        new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime(),
    );

  const chartData = sortedHistory.map((item) => ({
    timestamp: new Date(item.changedAt).getTime(),
    price: item.newPrice,
  }));

  const firstPrice = chartData[0]?.price;
  const lastPrice = chartData[chartData.length - 1]?.price;

  const variation =
    firstPrice != null && lastPrice != null && firstPrice > 0
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : 0;

  const priceDifference =
    firstPrice != null && lastPrice != null ? lastPrice - firstPrice : 0;

  const chartColor = variation <= 0 ? "#16a34a" : "#dc2626";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-5 w-48" />

          <Skeleton className="mt-6 h-10 w-40 rounded-xl" />

          <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr]">
            <Skeleton className="aspect-square rounded-2xl" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-72" />

              <Skeleton className="h-4 w-40" />

              <Skeleton className="h-28 w-full rounded-xl" />

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
    <main className="min-h-screen bg-muted/20">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm overflow-hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer transition-colors hover:text-foreground"
          >
            Produtos
          </button>

          <span>/</span>

          <span className="text-foreground truncate">{product.name}</span>
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

          <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
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
              <DollarSign className="size-4" />
              Adicionar preço
            </Button>

            <Button
              className="flex-1 cursor-pointer sm:flex-none"
              onClick={() =>
                navigate(`/products/${product.slug}/alerts/create`)
              }
            >
              <Bell className="size-4" />
              Criar alerta
            </Button>

            <Button
              variant={favorited ? "default" : "outline"}
              className="cursor-pointer col-span-2 sm:col-span-1"
              onClick={handleFavorite}
            >
              <Heart className={`size-4 ${favorited ? "fill-current" : ""}`} />

              {favorited ? "Favoritado" : "Favoritar"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="product" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="product" className="cursor-pointer">
              Produto
            </TabsTrigger>

            <TabsTrigger value="prices" className="cursor-pointer">
              Preços
            </TabsTrigger>

            <TabsTrigger value="history" className="cursor-pointer">
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="product" className="space-y-6">
            <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
              <Card
                className="
                    overflow-hidden
                    border-border/50
                    bg-card/70
                    backdrop-blur
                    w-full
                    lg:w-auto
                  "
              >
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

              <Card
                className="
                    border-primary/20
                    bg-card
                    shadow-md
                  "
              >
                <CardContent className="flex h-full flex-col gap-6 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={product.active ? "success" : "inactive"}
                        >
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>

                        <Badge variant="secondary">{product.category}</Badge>
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {product.name}
                      </h1>

                      <p className="text-muted-foreground">
                        {product.brand} • {product.model}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className={cardHoverClass}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                          <Tag className="size-4" />
                          Slug
                        </div>

                        <p className="text-sm text-muted-foreground break-all">
                          {product.slug}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className={cardHoverClass}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                          <Calendar className="size-4" />
                          Criado em
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {new Date(product.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Descrição</h2>

                    <p className="leading-relaxed text-muted-foreground">
                      {product.description || "Nenhuma descrição cadastrada."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className={cardHoverClass}>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Marca</p>
                        <p className="mt-1 font-medium">
                          {product.brand || "-"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className={cardHoverClass}>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Modelo</p>

                        <p className="mt-1 font-medium">
                          {product.model || "-"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className={cardHoverClass}>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Categoria
                        </p>

                        <p className="mt-1 font-medium">
                          {product.category || "-"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <Card className={cardHoverClass}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Menor preço
                    </span>

                    <TrendingDown className="size-4 text-green-600" />
                  </div>

                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {Number(stats?.lowestPrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className={cardHoverClass}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Maior preço
                    </span>

                    <TrendingUp className="size-4 text-red-600" />
                  </div>

                  <p className="text-xl sm:text-2xl font-bold text-red-600">
                    {Number(stats?.highestPrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className={cardHoverClass}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Média</span>

                    <Tag className="size-4 text-primary" />
                  </div>

                  <p className="text-xl sm:text-2xl font-bold">
                    {Number(stats?.averagePrice || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className={cardHoverClass}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lojas</span>

                    <Store className="size-4 text-primary" />
                  </div>

                  <p className="text-xl sm:text-2xl font-bold">
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
                          flex flex-col gap-4 rounded-xl border border-border/50 bg-card
                          p-4 transition-all duration-200
                          hover:-translate-y-1
                          hover:border-primary/30
                          hover:shadow-lg
                          sm:flex-row sm:items-center sm:justify-between
                        "
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {price.storeLogoUrl ? (
                            <img
                              src={price.storeLogoUrl}
                              alt={price.storeName}
                              className="h-8 max-w-[100px] object-contain"
                            />
                          ) : (
                            <Store className="size-5 text-muted-foreground" />
                          )}

                          <div className="flex flex-col">
                            <p className="font-medium">{price.storeName}</p>
                          </div>

                          <Badge
                            className="mt-1 w-fit"
                            variant={price.available ? "success" : "inactive"}
                          >
                            {price.available ? "Disponível" : "Indisponível"}
                          </Badge>
                        </div>

                        {price.installmentQuantity > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Em até {price.installmentQuantity}x de{" "}
                            {Number(price.installmentValue).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              },
                            )}
                          </p>
                        )}

                        {price.shippingPrice > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Frete:{" "}
                            {Number(price.shippingPrice).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              },
                            )}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                            flex flex-col
                            items-start
                            gap-2
                            sm:items-end
                            sm:text-right
                          "
                      >
                        <p className="text-3xl font-bold text-green-600">
                          {Number(price.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>

                        <Button
                          size="sm"
                          className="cursor-pointer"
                          onClick={() =>
                            window.open(
                              price.productUrl,
                              "_blank",
                              "noopener,noreferrer",
                            )
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
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <h2 className="text-xl font-semibold">
                      Histórico de preços
                    </h2>

                    <Badge variant={variation <= 0 ? "success" : "destructive"}>
                      {variation > 0
                        ? "↑ Subiu"
                        : variation < 0
                          ? "↓ Caiu"
                          : "→ Estável"}

                      {" • "}

                      {formatCurrency(Math.abs(priceDifference).toFixed(2))}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Últimas alterações de preço encontradas
                  </p>
                </div>

                <div className="mb-8 h-[250px] sm:h-[320px] w-full">
                  {chartData.length === 0 ? (
                    <div className="flex h-[320px] items-center justify-center text-muted-foreground">
                      Nenhum histórico encontrado
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 30,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="0" opacity={0.1} />

                        <XAxis
                          dataKey="timestamp"
                          type="number"
                          scale="time"
                          domain={["auto", "auto"]}
                          tickFormatter={(value) => {
                            const date = new Date(value);

                            return chartData.length <= 20
                              ? date.toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : date.toLocaleDateString("pt-BR");
                          }}
                        />

                        <YAxis
                          domain={[
                            (dataMin: number) => dataMin - dataMin * 0.05,
                            (dataMax: number) => dataMax + dataMax * 0.05,
                          ]}
                          tickFormatter={(value) =>
                            value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          }
                          padding={{
                            bottom: 20,
                          }}
                        />

                        <Tooltip
                          cursor={false}
                          labelFormatter={(label) =>
                            `Data: ${new Date(label).toLocaleString("pt-BR")}`
                          }
                          formatter={(value) => [
                            formatCurrency(Number(value).toString()),
                            "Preço",
                          ]}
                          isAnimationActive={false}
                        />

                        <Line
                          type="stepAfter"
                          dataKey="price"
                          stroke={chartColor}
                          strokeWidth={3}
                          isAnimationActive={false}
                          dot={{ r: 4 }}
                          activeDot={{
                            r: 10,
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
