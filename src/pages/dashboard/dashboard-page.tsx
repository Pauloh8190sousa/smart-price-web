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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { logout } from "@/lib/auth";
import { getProducts } from "@/services/product/get-products";
import type { Product } from "@/types/product";

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img
              src={logoWeb}
              alt="Smart Price"
              className="h-14 w-auto object-contain"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            aria-label="Sair da conta"
            className="transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>

            <p className="text-muted-foreground">
              Visualize e gerencie os produtos cadastrados
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative sm:w-80">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="search"
                  autoComplete="off"
                  aria-label="Buscar produto"
                  placeholder="Buscar produto..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/stores")}
                  className="cursor-pointer"
                >
                  <Store className="size-4" />
                  Gerenciar Lojas
                </Button>

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => navigate("/alerts")}
                >
                  <Bell className="size-4" />
                  Alertas
                </Button>

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => navigate("/favorites")}
                >
                  <Heart className="size-4" />
                  Favoritos
                </Button>

                <Button
                  onClick={() => navigate("/products/create")}
                  className="cursor-pointer"
                >
                  <Plus className="size-4" />
                  Adicionar Produto
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pl-2">
              {filteredProducts.length} produto(s) encontrado(s)
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Package className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total de produtos
                </p>

                <h3 className="text-2xl font-bold">
                  {filteredProducts.length}
                </h3>
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
                    <div className="h-20 w-20 animate-pulse rounded-lg bg-muted" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-muted" />

                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
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
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products/${product.slug}`);
                  }
                }}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-primary/40
                  hover:shadow-lg
                "
              >
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.imageUrl || "/placeholder-product.png"}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-product.png";
                      }}
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 font-semibold">
                          {product.name}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            product.active
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {product.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>

                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {product.brand} • {product.model}
                      </p>

                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>

                      <div className="pt-2">
                        <span className="rounded-md bg-muted px-2 py-1 text-xs">
                          {product.category}
                        </span>
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
