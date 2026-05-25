import { api } from "@/lib/api";
import type { Product } from "@/types/product";

export async function getProductBySlug(slug: string) {
  const response = await api.get<Product>(`/api/products/slug/${slug}`);

  return response.data;
}
