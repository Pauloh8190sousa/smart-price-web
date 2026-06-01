// services/favorite/get-favorites.ts

import { api } from "@/lib/api";

import type { FavoriteProduct } from "@/types/favorite-product";

export async function getFavorites(userId: string) {
  const response = await api.get<FavoriteProduct[]>(
    `/api/favorite-products/user/${userId}`,
  );

  return response.data;
}
