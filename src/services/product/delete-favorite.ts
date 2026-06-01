// services/favorite/delete-favorite.ts

import { api } from "@/lib/api";

export async function deleteFavorite(id: string) {
  await api.delete(`/api/favorite-products/${id}`);
}
