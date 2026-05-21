import { api } from "@/lib/api";

import type { Product } from "@/types/product";

export async function getProducts() {
  const response = await api.get<Product[]>("/api/products");

  return response.data;
}
