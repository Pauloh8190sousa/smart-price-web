import { LogOut, Package, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { removeToken } from "@/lib/auth";
import { getProducts } from "@/services/product/get-products";
import type { Product } from "@/types/product";

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        toast.error("Erro ao carregar produtos");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const navigate = useNavigate();

  function handleLogout() {
    removeToken();

    toast.success("Logout realizado com sucesso");

    navigate("/", {
      replace: true,
    });
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Smart Price</h1>

            <p className="text-sm text-muted-foreground">
              Gerenciamento de produtos e preços
            </p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut />
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

          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Buscar produto..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                    <div className="size-20 animate-pulse rounded-lg bg-muted" />

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
                className="transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.imageUrl || "/placeholder-product.png"}
                      alt={product.name}
                      className="size-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-product.png";
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="line-clamp-1 font-semibold">
                        {product.name}
                      </h3>

                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {product.brand}
                      </p>

                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && filteredProducts.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[300px] items-center justify-center">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
