import {
  Bell,
  Heart,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import logoWeb from "@/assets/logoWeb.png";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { logout } from "@/lib/auth";
import { getProducts } from "@/services/product/get-products";
import type { Product } from "@/types/product";

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch {
        toast.error("Erro ao carregar produtos");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleLogout() {
    logout();

    toast.success("Logout realizado com sucesso");

    navigate("/", {
      replace: true,
    });
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.model,
        product.category,
        product.description,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch)),
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sair
          </Button>

          <img
            src={logoWeb}
            alt="Smart Price"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie os produtos cadastrados
            </p>
          </div>

          <Button
            onClick={() => navigate("/products/create")}
            className="cursor-pointer"
          >
            <Plus className="size-4" />
            Novo Produto
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
              placeholder="Buscar produto..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Exibindo {filteredProducts.length} de {products.length} produtos
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-border/50 bg-card shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Package className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total de produtos
                </p>

                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className={cardHoverClass} onClick={() => navigate("/stores")}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Store className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Lojas</p>
                <p className="text-sm text-muted-foreground">Gerenciar lojas</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cardHoverClass} onClick={() => navigate("/alerts")}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Bell className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alertas</p>
                <p className="text-sm text-muted-foreground">Monitorar</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cardHoverClass}
            onClick={() => navigate("/favorites")}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Favoritos</p>
                <p className="text-sm text-muted-foreground">Produtos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-lg" />

                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />

                      <Skeleton className="h-3 w-24" />

                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                role="button"
                aria-label={`Abrir produto ${product.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products/${product.slug}`);
                  }
                }}
                onClick={() => navigate(`/products/${product.slug}`)}
                className={cardHoverClass}
              >
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex gap-4">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-muted/20 p-2">
                      <img
                        src={product.imageUrl || "/placeholder-product.png"}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 font-semibold">
                          {product.name}
                        </h3>

                        <Badge
                          variant={product.active ? "success" : "inactive"}
                        >
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {product.brand} • {product.model}
                      </p>

                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>

                      <div className="pt-2">
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();

                        toast.info(`Editar ${product.name}`);
                      }}
                    >
                      <Pencil className="size-4" />
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();

                        toast.warning(`Excluir ${product.name}`);
                      }}
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

        {!isLoading && filteredProducts.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <Package className="size-10 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {search
                      ? "Nenhum produto encontrado"
                      : "Nenhum produto cadastrado"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {search
                      ? "Tente buscar outro termo."
                      : "Os produtos aparecerão aqui."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
