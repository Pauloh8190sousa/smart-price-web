// pages/favorite/favorites-page.tsx

import { ArrowLeft, Heart, Search, Trash2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getUser } from "@/lib/auth";

import { deleteFavorite } from "@/services/product/delete-favorite";
import { getFavorites } from "@/services/product/get-favorites";

import logoWeb from "@/assets/logoWeb.png";
import type { FavoriteProduct } from "@/types/favorite-product";

export function FavoritesPage() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  async function loadFavorites() {
    try {
      const user = getUser();

      const data = await getFavorites(user.id);

      setFavorites(data);
    } catch {
      toast.error("Erro ao carregar favoritos");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  const filteredFavorites = useMemo(() => {
    const value = search.trim().toLowerCase();

    return favorites.filter(
      (favorite) =>
        favorite.productName.toLowerCase().includes(value) ||
        favorite.productSlug.toLowerCase().includes(value),
    );
  }, [favorites, search]);

  async function handleDelete(id: string) {
    try {
      await deleteFavorite(id);

      setFavorites((current) =>
        current.filter((favorite) => favorite.id !== id),
      );

      toast.success("Favorito removido");
    } catch {
      toast.error("Erro ao remover favorito");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          <img
            src={logoWeb}
            alt="Smart Price"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Favoritos</h1>

          <p className="text-muted-foreground">Produtos salvos por você</p>
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
            Exibindo {filteredFavorites.length} de {favorites.length} favoritos
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
                <Heart className="size-5 fill-current" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Produtos favoritados
                </p>

                <h3 className="text-3xl font-bold">{favorites.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="h-32 animate-pulse bg-muted" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFavorites.map((favorite) => (
              <Card
                key={favorite.id}
                className={cardHoverClass}
                onClick={() => navigate(`/products/${favorite.productSlug}`)}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex justify-center">
                    <img
                      src={
                        favorite.productImageUrl || "/placeholder-product.png"
                      }
                      alt={favorite.productName}
                      className="h-40 w-full rounded-lg object-contain bg-muted/20 p-2"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-product.png";
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="line-clamp-2 font-semibold">
                        {favorite.productName}
                      </h3>

                      <Heart className="size-4 fill-current text-red-500" />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {favorite.productSlug}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="
                        w-full
                        border-red-500
                        text-red-500
                        hover:bg-red-500
                        hover:text-white
                        cursor-pointer
                      "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(favorite.id);
                      }}
                    >
                      <Trash2 className="size-4" />
                      Remover dos favoritos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredFavorites.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[250px] items-center justify-center">
              <div className="text-center">
                <Heart className="mx-auto mb-3 size-10 text-muted-foreground" />

                <p className="font-medium">Nenhum favorito encontrado</p>

                <p className="text-sm text-muted-foreground">
                  Favorite produtos para acessá-los rapidamente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
