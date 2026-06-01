// services/favorite/create-favorite.ts

import { api } from "@/lib/api";

export async function createFavorite(data: {
  userId: string;
  productId: string;
}) {
  const response = await api.post("/api/favorite-products", data);

  return response.data;
}
