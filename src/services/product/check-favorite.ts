// services/favorite/check-favorite.ts

import { api } from "@/lib/api";
import type { FavoriteCheckResponse } from "@/types/favorite-check";

export async function checkFavorite(userId: string, productId: string) {
  const response = await api.get<FavoriteCheckResponse>(
    "/api/favorite-products/check",
    {
      params: {
        userId,
        productId,
      },
    },
  );

  return response.data;
}
