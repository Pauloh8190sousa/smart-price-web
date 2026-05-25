import { api } from "@/lib/api";

export async function getProductBySlug(slug: string) {
  const response = await api.get(`/api/products/slug/${slug}`);

  return response.data;
}
