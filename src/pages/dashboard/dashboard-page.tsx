import { LogOut, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
              <SidebarTrigger className="h-10 w-10 border rounded-md" />

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="size-4" />
                Sair
              </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Produtos
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground">
                  Visualize e gerencie os produtos cadastrados
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate("/products/create")}
                  className="cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  Novo Produto
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
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

              <p className="text-xs sm:text-sm text-muted-foreground">
                Exibindo {filteredProducts.length} de {products.length} produtos
              </p>
            </div>

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

                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {search
                          ? "Tente buscar outro termo."
                          : "Os produtos aparecerão aqui."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className={`${cardHoverClass} min-h-[480px]`}
                  >
                    <CardContent className="flex h-full flex-col p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={product.active ? "success" : "inactive"}
                          >
                            {product.active ? "Ativo" : "Inativo"}
                          </Badge>

                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <div className="flex h-52 items-center justify-center rounded-lg bg-muted/20 p-4">
                          <img
                            src={product.imageUrl || "/placeholder-product.png"}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm sm:text-base font-semibold">
                              {product.name}
                            </h3>
                          </div>

                          <p className="line-clamp-1 text-xs sm:text-sm text-muted-foreground">
                            {product.brand} • {product.model}
                          </p>

                          <p className="line-clamp-5 text-xs sm:text-sm text-muted-foreground mb-4">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs sm:text-sm"
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
                          className="flex-1 text-xs sm:text-sm"
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
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
